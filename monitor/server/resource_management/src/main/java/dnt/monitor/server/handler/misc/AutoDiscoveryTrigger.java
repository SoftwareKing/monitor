/**
 * Developer: Kadvin Date: 15/3/12 下午2:29
 */
package dnt.monitor.server.handler.misc;

import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.DiscoveryException;
import dnt.monitor.server.handler.engine.EngineApprovalListener;
import dnt.monitor.server.model.EngineOnlineSession;
import dnt.monitor.server.service.ServerDiscoveryService;
import net.happyonroad.concurrent.OnceTrigger;
import net.happyonroad.event.ObjectCreatedEvent;
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
public class AutoDiscoveryTrigger extends EngineApprovalListener {
    @Autowired
    ServerDiscoveryService serverDiscover;
    //资源equals默认的是按照id来的
    Map<MonitorEngine, Integer> engineConditions = new HashMap<MonitorEngine, Integer>();
    @Autowired
    TaskScheduler systemScheduler;

    @org.springframework.context.annotation.Bean
    public EngineSessionListener engineSessionListener (){
        return new EngineSessionListener();
    }

    @Override
    protected void onApprove(MonitorEngine engine, MonitorEngine... oldEngines) {
        int depth = Integer.valueOf(engine.getProperty("discovery.depth", "1"));
        if ( depth <= 0 ) return;
        Integer value = engineConditions.get(engine);
        if (value == null) value = 0;
        value = maskValue(value, 1, true);
        engineConditions.put(engine, value);
        checkTrigger(engine);
    }

    void checkTrigger(final MonitorEngine engine) {
        Integer value = engineConditions.get(engine);
        if( value != null && value == 3 ){
            engineConditions.remove(engine);
            OnceTrigger trigger = new OnceTrigger(System.currentTimeMillis() + 2000 );
            systemScheduler.schedule(new EngineFirstDiscoveryTask(engine), trigger);
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

    class EngineSessionListener implements ApplicationListener<ObjectCreatedEvent<EngineOnlineSession>>{
        @Override
        public void onApplicationEvent(ObjectCreatedEvent<EngineOnlineSession> event) {
            MonitorEngine engine = event.getSource().getEngine();
            Integer value = engineConditions.get(engine);
            if (value == null) value = 0;
            value = maskValue(value, 2, true);
            engineConditions.put(engine, value);
            checkTrigger(engine);
        }
    }
}
