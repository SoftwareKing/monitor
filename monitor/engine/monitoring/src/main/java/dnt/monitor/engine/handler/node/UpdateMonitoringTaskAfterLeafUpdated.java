package dnt.monitor.engine.handler.node;

import com.google.common.collect.MapDifference;
import dnt.monitor.engine.service.MonitoringTaskStore;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.model.Record;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static net.happyonroad.util.DiffUtils.difference;

/**
 * <h1>特定资源节点更新之后，更新相应的监控任务</h1>
 *
 * @author Jay Xiong
 */
@Component
class UpdateMonitoringTaskAfterLeafUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<ResourceNode>> {
    @Autowired
    NodeStore           nodeStore;
    @Autowired
    MonitoringTaskStore taskService;


    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<ResourceNode> event) {
        ResourceNode legacyNode = event.getLegacySource();
        String path = legacyNode.getPath();
        MonitoringTask task = taskService.findTask(path);
        if (task != null) {
            ResourceNode effectiveNode = task.getNode();
            ResourceNode mergedNode = nodeStore.merge(event.getSource());
            MapDifference<String, Object> differences = difference(effectiveNode, mergedNode, Record.HELP_ATTRS);
            if (!differences.areEqual()) {
                taskService.updateTask(path, mergedNode);
            }
        }
    }
}
