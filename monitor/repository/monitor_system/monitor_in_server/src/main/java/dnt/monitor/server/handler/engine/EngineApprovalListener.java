package dnt.monitor.server.handler.engine;

import dnt.monitor.model.MonitorEngine;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.event.ObjectSavedEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.context.ApplicationListener;

/**
 * <h1>监控引擎被批准/拒绝的监听器</h1>
 * <p/>
 * 可以兼容创建时直接批准/拒绝或者后继修改时批准/拒绝两种情况
 *
 * @author Jay Xiong
 */
public abstract class EngineApprovalListener extends Bean
        implements ApplicationListener<ObjectSavedEvent<MonitorEngine>> {

    @Override
    public final void onApplicationEvent(ObjectSavedEvent<MonitorEngine> event) {
        if (event instanceof ObjectCreatedEvent) {
            MonitorEngine engine = event.getSource();
            if (engine.isApproved())
                onApprove(engine);
            else if (engine.isRejected())
                onReject(engine);
        } else {
            MonitorEngine oldEngine = ((ObjectUpdatedEvent<MonitorEngine>) event).getLegacySource();
            MonitorEngine newEngine = (MonitorEngine) ((ObjectUpdatedEvent) event).getSource();
            if (MonitorEngine.isApproving(oldEngine, newEngine))
                onApprove(newEngine, oldEngine);
            else if (MonitorEngine.isRejecting(oldEngine, newEngine))
                onReject(newEngine, oldEngine);
        }
    }

    protected void onApprove(MonitorEngine engine, MonitorEngine... oldEngines) {
    }

    protected void onReject(MonitorEngine engine, MonitorEngine... oldEngines) {
    }

}
