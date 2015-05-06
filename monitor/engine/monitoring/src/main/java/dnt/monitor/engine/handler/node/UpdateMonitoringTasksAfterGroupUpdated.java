package dnt.monitor.engine.handler.node;

import com.google.common.collect.MapDifference;
import dnt.monitor.engine.service.MonitoringTaskStore;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.model.Record;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

import static net.happyonroad.util.DiffUtils.difference;

/**
 * <h1>群组节点更新之后，更新下面所有的监控任务</h1>
 *
 * @author Jay Xiong
 */
@Component
class UpdateMonitoringTasksAfterGroupUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<GroupNode>> {
    @Autowired
    NodeStore           nodeStore;
    @Autowired
    MonitoringTaskStore taskService;


    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<GroupNode> event) {
        GroupNode legacyNode = event.getLegacySource();
        String path = legacyNode.getPath();
        List<MonitoringTask> tasks = taskService.findTasks(path);
        for (MonitoringTask task : tasks) {
            ResourceNode effectiveNode = task.getNode();
            ResourceNode node = (ResourceNode) nodeStore.findByPath(effectiveNode.getPath());
            ResourceNode mergedNode = nodeStore.merge(node);
            MapDifference<String, Object> differences = difference(effectiveNode, mergedNode, Record.HELP_ATTRS);
            if (!differences.areEqual()) {
                taskService.updateTask(task.getPath(), mergedNode);
            }

        }
    }
}
