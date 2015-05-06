package dnt.monitor.engine.handler.task;

import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.engine.service.MonitoringService;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>创建监控任务之后，如果其状态为Running，则启动实际监控工作</h1>
 *
 * @author Jay Xiong
 */
@Component
class StartMonitoringTaskAfterCreation extends Bean
        implements ApplicationListener<ObjectCreatedEvent<MonitoringTask>> {

    @Autowired
    NodeStore         nodeStore;
    @Autowired
    MonitoringService executor;

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<MonitoringTask> event) {
        MonitoringTask task = event.getSource();
        ResourceNode merged = nodeStore.merge(task.getNode());
        if (merged.isRunning()) {
            executor.start(task);
        }
    }
}
