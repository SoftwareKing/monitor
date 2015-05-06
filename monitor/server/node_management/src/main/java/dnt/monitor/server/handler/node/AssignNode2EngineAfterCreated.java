/**
 * Developer: Kadvin Date: 15/1/1 下午7:16
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.service.ConfigurationService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>将管理节点同步到对应采集引擎</h1>
 * <p/>
 * 当资源被创建之后，需要将其同步到对应的采集引擎
 * 创建的资源，可能为：
 * <ol>
 * <li> 在某个采集范围下的资源
 * 需要将该资源分配到相应的采集引擎去，如果对应的采集引擎不在线，则应该等引擎在线后再执行相应的任务
 * </ol>
 * <p/>
 * 通过以上的分析可见，这里需要执行的任务都可能是很耗时/不确定的任务；所以都应该异步化/存储化之
 * 所谓异步化：就是该任务的执行情况不应该影响资源对象的创建流程
 * 所谓存储化：就是该任务的执行，可以经受多次失败，可以等到相关资源到位之后再执行
 */
@Component
class AssignNode2EngineAfterCreated extends Bean
        implements ApplicationListener<ObjectCreatedEvent<ManagedNode>> {
    @Autowired
    NodeService          nodeService;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    public AssignNode2EngineAfterCreated() {
        setOrder(100);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<ManagedNode> event) {
        ManagedNode node = event.getSource();
        //Root/Infrastructure Node在刚刚创建时，不发送到任何一个监控引擎上
        if (node.isRoot() || node.isInfrastructure()) return;
        //ScopeNode也不应该在创建后发送到监控引擎上(因为其早于engine创建)
        //Scope Node 应该将root node的信息copy带过去
        if (node.isScope()) return;
        //SystemNode也不应该在创建后发送到监控引擎上(因为其早于engine创建)
        if (node.isSystem()) return;
        //Engine, ServerNode由 AssignRelatedNodes2EngineAfterCreated 自行分配过去
        // 因为如果在他们的节点创建时就直接分配过去的话，其上级管理节点还没有分配过去呢
        if (node instanceof ResourceNode) {
            ResourceNode rescNode = (ResourceNode) node;
            //Resource has been removed
            if( rescNode.getResource() == null ) return;
            if (rescNode.isEngineNode()) return;
            //
            if (rescNode.isServerNode()) return;
        }
        MonitorEngine engine;
        try {
            engine = nodeService.findEngineByNode(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't find engine for " + node);
        }
        if (engine.isRequesting()) {
            logger.debug("The engine is not approved, do not assign any node to it");
            return;
        } else if (engine.isRejected()) {
            logger.debug("The engine is rejected, do not assign any node to it");
            return;
        }
        // get Engine NBI for resource service by factory bean
        ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
        try {
            //分配节点时，不将resource发送过去
            if (node instanceof ResourceNode) {
                ResourceNode resourceNode = ((ResourceNode) node);
                String address = resourceNode.getResource().getAddress();
                Resource resource = resourceNode.getResource();
                resourceNode.setResource(null);
                try {
                    configurationService.assignResourceNode(resourceNode, address);
                } finally {
                    resourceNode.setResource(resource);
                }
            } else{
                //无论是ip range，还是具体节点，都分配过去，由引擎处理
                configurationService.assignNode(node);
            }
        } catch (OfflineException e) {
            logger.debug("{} has been assigned to an offline {}", node, engine);
        } catch (EngineException e) {
            //TODO 实际代码应该是将该node设置为未同步状态，而后有其他的代码/任务负责定期将该range信息同步给相应的引擎
            logger.warn("Can't assign {} to {}", node, engine);
        }

    }

}
