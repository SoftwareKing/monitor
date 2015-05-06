package dnt.monitor.engine.handler.task;

import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.engine.service.MonitoringService;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>当监控任务更新时，调整实际的监控工作</h1>
 *
 * @author Jay Xiong
 */
@Component
class AdjustMonitoringTaskAfterUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<MonitoringTask>> {
    @Autowired
    NodeStore         nodeStore;
    @Autowired
    MonitoringService executor;

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<MonitoringTask> event) {
        MonitoringTask newTask = event.getSource();
        ResourceNode merged = nodeStore.merge(newTask.getNode());
        MonitoringTask oldTask = event.getLegacySource();
        ResourceNode oldMerged = nodeStore.merge(oldTask.getNode());
        if (oldMerged.isStopped()) {
            if (merged.isStopped()) {
                logger.debug("{} is updated, but not been monitoring now", newTask);
            } else {
                executor.start(newTask);
            }
        } else {
            if (merged.isStopped()) {
                executor.stop(newTask);
            } else {
                executor.update(newTask);
            }
        }
    }
}
