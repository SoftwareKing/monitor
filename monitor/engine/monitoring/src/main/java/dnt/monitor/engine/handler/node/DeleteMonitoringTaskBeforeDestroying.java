package dnt.monitor.engine.handler.node;

import dnt.monitor.engine.service.MonitoringTaskStore;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>在删除节点之前，删除资源监控任务</h1>
 *
 * @author Jay Xiong
 */
@Component
class DeleteMonitoringTaskBeforeDestroying extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<ResourceNode>> {
    @Autowired
    MonitoringTaskStore taskService;

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<ResourceNode> event) {
        ResourceNode node = event.getSource();
        //具体有没有任务，由 task service内部判断
        taskService.removeTask(node.getPath());
    }
}
