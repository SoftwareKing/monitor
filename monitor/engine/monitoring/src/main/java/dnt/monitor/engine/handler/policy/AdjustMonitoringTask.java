package dnt.monitor.engine.handler.policy;

import com.google.common.collect.MapDifference;
import dnt.monitor.engine.service.MonitoringTaskStore;
import dnt.monitor.engine.service.PolicyStore;
import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.policy.ResourcePolicy;
import net.happyonroad.event.ObjectDestroyedEvent;
import net.happyonroad.event.ObjectEvent;
import net.happyonroad.event.ObjectSavedEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.model.Record;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

import static net.happyonroad.util.DiffUtils.difference;

/**
 * <h1>资源策略发生变化之后，调整监控任务</h1>
 *
 * @author Jay Xiong
 */
@Component
class AdjustMonitoringTask extends Bean
        implements ApplicationListener<ObjectEvent<ResourcePolicy>> {
    @Autowired
    MonitoringTaskStore taskService;
    @Autowired
    PolicyStore         policyStore;

    @Override
    public void onApplicationEvent(ObjectEvent<ResourcePolicy> event) {
        if (!(event instanceof ObjectSavedEvent) && !(event instanceof ObjectDestroyedEvent)) {
            return;
        }
        ResourcePolicy policy = event.getSource();
        List<MonitoringTask> tasks = taskService.findTasksByResourceType(policy.getResourceType());
        for (MonitoringTask task : tasks) {
            ResourcePolicy newPolicy = policyStore.match(task.getNode());
            ResourcePolicy oldPolicy = task.getPolicy();
            if (newPolicy.getId().equals(oldPolicy.getId())) {
                //策略并未变化，这说明，无论是新增，还是删除策略，都对本任务没有影响
                // 因为task的oldPolicy不可能为新增策略，再次match出来的newPolicy，不可能为被删除的策略
                // 所以，此时，对本任务有影响的只有updated event
                if (event instanceof ObjectUpdatedEvent) {
                    if (policy.getId().equals(oldPolicy.getId())) {
                        //此次更新的策略恰好是资源所应用的策略
                        MapDifference<String, Object> differences = difference(oldPolicy, newPolicy, Record.HELP_ATTRS);
                        if( !differences.areEqual() ){
                            taskService.updateTask(task.getPath(), newPolicy);
                        }
                    }
                }
            }else {
                //这个监控任务对应的策略发生了变化
                taskService.updateTask(task.getPath(), newPolicy);
            }
        }
    }
}
