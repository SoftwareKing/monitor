package dnt.monitor.engine.handler.node;

import dnt.monitor.engine.service.MonitoringTaskStore;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.engine.service.PolicyStore;
import dnt.monitor.engine.service.ResourceStore;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;
import net.happyonroad.event.ObjectCreatedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>为资源节点构建监控任务</h1>
 *
 *  资源节点的监控状态应该为 Running
 *
 * @author Jay Xiong
 */
@Component
class CreateMonitoringTaskAfterCreation implements ApplicationListener<ObjectCreatedEvent<ResourceNode>>{
    @Autowired
    NodeStore           nodeStore;
    @Autowired
    ResourceStore       resourceStore;
    @Autowired
    PolicyStore         policyStore;
    @Autowired
    MonitoringTaskStore taskService;

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<ResourceNode> event) {
        ResourceNode node = event.getSource();
        //在节点库里面的资源节点都没有直接关联资源对象
        ResourceNode merged = nodeStore.merge(node);
        //为了便于在redis-cli里面查看实际的任务情况
        //if( merged.isStopped() ) return;
        //资源节点存在时，资源对象也一定入库了
        Resource resource = resourceStore.findById(node.getResourceId());
        merged.setResource(resource);
        ResourcePolicy policy = policyStore.match(merged);
        //创建的任务，未必真的启动
        taskService.createTask(merged, policy);
    }
}
