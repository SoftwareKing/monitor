/**
 * Developer: Kadvin Date: 15/1/27 下午9:20
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.service.ConfigurationService;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>当指向资源的管理节点被更新时，为其更新资源信息</h1>
 * 当用户(管理员)更新管理节点时，如果其资源节点被修改了，则首先更新之
 */
@Component
class UpdateEngineAfterNodeUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<ManagedNode>> {
    @Autowired
    ServiceLocator serviceLocator;
    @Autowired
    NodeService nodeService;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<ManagedNode> event) {
        ManagedNode node = event.getSource();
        try {
            // 如果是根节点被修改，则需要将查出所有的scope node，并同步给对应的监控引擎（已经被批准）
            if (node.isRoot()) {
                syncScopeNodes(node);
            } else if( node.isInfrastructure() ) {
                syncSystemNodes(node);
            } else {
                syncNodeToEngine(node);
            }
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't sync node to engine", e);
        }
    }

    void syncNodeToEngine(ManagedNode node) throws NodeException {
        MonitorEngine engine;
        try {
            engine = nodeService.findEngineByNode(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't find engine for " + node);
        }
        if( engine.isRequesting()) {
            logger.debug("The engine is not approved, do not sync any node to it");
            return;
        }else if (engine.isRejected() ){
            logger.debug("The engine is rejected, do not sync any node to it");
            return;
        }
        // get Engine NBI for resource service by factory bean
        ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
        try {
            //无论是ip range，还是具体节点，都分配过去，由引擎处理
            configurationService.updateNode(node);
        } catch (EngineException e) {
            logger.warn("Can't sync {} to {}", node, engine);
        }

    }

    void syncSystemNodes(ManagedNode parent) throws NodeException {
        List<ManagedNode> systemNodes = nodeService.findSubNodes(parent, 1, false);
        for (ManagedNode systemNode : systemNodes) {
            // 将Parent的属性合并到scope node上
            systemNode.merge(parent);
            syncNodeToEngine(systemNode);
        }
    }

    void syncScopeNodes(ManagedNode root) throws NodeException {
        List<ManagedNode> scopeNodes = nodeService.findSubNodes(root, 1, false);
        for (ManagedNode scopeNode : scopeNodes) {
            scopeNode.merge(root);
            // system node
            if( scopeNode.isInfrastructure() )
            {
                syncSystemNodes(scopeNode);
            }else{
                // 将root的属性合并到scope node上
                syncNodeToEngine(scopeNode);
            }
        }
    }
}
