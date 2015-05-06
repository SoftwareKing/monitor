package dnt.monitor.engine.handler.task;

import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.engine.service.MonitoringService;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>在删除监控任务之前，停止相应的实际监控工作</h1>
 *
 * @author Jay Xiong
 */
@Component
class StopMonitoringTaskBeforeDestroying extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<MonitoringTask>> {
    @Autowired
    MonitoringService executor;
    @Autowired
    NodeStore         nodeStore;


    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<MonitoringTask> event) {
        MonitoringTask task = event.getSource();
        ResourceNode merged = nodeStore.merge(task.getNode());
        if (merged.isRunning()) {
            executor.stop(task);
        }
    }
}
