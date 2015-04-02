/**
 * Developer: Kadvin Date: 15/3/12 下午2:29
 */
package dnt.monitor.server.handler.misc;

import dnt.monitor.server.model.EngineOnlineSession;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.DiscoveryException;
import dnt.monitor.server.service.ServerDiscoveryService;
import net.happyonroad.concurrent.OnceTrigger;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.event.ObjectSavedEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * <h1>自动触发特定引擎的首次发现服务</h1>
 * <p/>
 * 达到自动触发的情况为：
 * <ul>
 * <li> 特定监控引擎被批准: ObjectSavedEvent&lt;MonitorEngine&gt;
 * <li> 且建立引擎会话：ObjectSavedEvent&lt;EngineOnlineSession&gt;
 * </ul>
 */
@Component
public class AutoDiscoveryTrigger extends Bean implements ApplicationListener<ObjectSavedEvent> {
    @Autowired
    ServerDiscoveryService serverDiscover;
    //资源equals默认的是按照id来的
    Map<MonitorEngine, Integer> engineConditions = new HashMap<MonitorEngine, Integer>();
    @Autowired
    TaskScheduler systemScheduler;

    @Override
    public void onApplicationEvent(ObjectSavedEvent event) {
        if (event.getSource() instanceof MonitorEngine) {
            MonitorEngine engine = (MonitorEngine) event.getSource();
            boolean approved;
            if (event instanceof ObjectUpdatedEvent) {
                //noinspection unchecked
                ObjectUpdatedEvent<MonitorEngine> updatedEvent = (ObjectUpdatedEvent<MonitorEngine>) event;
                engine = updatedEvent.getSource();
                approved = updatedEvent.getLegacySource().isRequesting() && engine.isApproved();
            } else {
                approved = engine.isApproved();
            }
            if ("false".equalsIgnoreCase(engine.getProperty("discovery.auto"))) {
                return;
            }
            Integer value = engineConditions.get(engine);
            if (value == null) value = 0;
            value = maskValue(value, 1, approved);
            engineConditions.put(engine, value);
        } else if (event.getSource() instanceof EngineOnlineSession) {
            MonitorEngine engine = ((EngineOnlineSession) event.getSource()).getEngine();
            boolean online = (event instanceof ObjectCreatedEvent);
            Integer value = engineConditions.get(engine);
            if (value == null) value = 0;
            value = maskValue(value, 2, online);
            engineConditions.put(engine, value);
        }
        Iterator<Map.Entry<MonitorEngine, Integer>> it = engineConditions.entrySet().iterator();
        int n = 1;
        while (it.hasNext()) {
            Map.Entry<MonitorEngine, Integer> entry = it.next();
            if (entry.getValue() == 3) {
                it.remove();
                OnceTrigger trigger = new OnceTrigger(System.currentTimeMillis() + 2000 + 100 * n++);
                systemScheduler.schedule(new EngineFirstDiscoveryTask(entry.getKey()), trigger);
            }
        }
    }

    Integer maskValue(int originValue, int maskValue, boolean mask) {
        if (mask) return originValue | maskValue;
        else return originValue & ~maskValue;
    }

    class EngineFirstDiscoveryTask implements Runnable {
        final MonitorEngine engine;

        public EngineFirstDiscoveryTask(MonitorEngine engine) {
            this.engine = engine;
        }

        @Override
        public void run() {
            try {
                serverDiscover.startFirstDiscovery(engine);
            } catch (DiscoveryException e) {
                logger.error("Failed to start first discovery of " + engine, e);
            }
        }
    }
}
