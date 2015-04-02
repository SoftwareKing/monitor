/**
 * Developer: Kadvin Date: 15/1/14 上午11:03
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectDestroyedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>当引擎的管理节点被清除后，其相应的监控范围，系统节点 应该已经空了，需要被自动清除</h1>
 *
 * 不过，也有一种情况，是用户通过删除监控范围来删除监控引擎，此时监控引擎应该已经被标记为 hierarchyDelete
 */
@Component
class DeleteRelatedNodesAfterEngineNodeDestroyed extends Bean
        implements ApplicationListener<ObjectDestroyedEvent<ResourceNode>> {

    @Autowired
    NodeService nodeService;

    // engine system path: /infrastructure/default, /infrastructure/engine1,
    // engine path: /infrastructure/default/engine, /infrastructure/engine1/engine,
    // engine scope path: /default, /engine1,
    @Override
    public void onApplicationEvent(ObjectDestroyedEvent<ResourceNode> event) {
        ResourceNode node = event.getSource();
        if( node.isHierarchyDeleting()) return;
        if(!node.isEngineNode()) return;

        String scopePath = StringUtils.substringBetween(node.getPath(), ManagedNode.INFRASTRUCTURE_PATH, "/engine");
        ManagedNode scopeNode = nodeService.findByPath(scopePath);
        try {
            nodeService.delete(scopeNode);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't clean system node", e);
        } catch (UnsupportedOperationException e) {
            throw new ApplicationContextException("The resource under " + scopePath + " is not cleaned", e);
        }

        String systemPath = StringUtils.substringBefore(node.getPath(), "/engine");
        ManagedNode systemNode = nodeService.findByPath(systemPath);
        try {
            nodeService.delete(systemNode);
        } catch (Exception e) {
            logger.warn("Can't delete the system node of the engine: " + systemPath + ", because of " + e.getMessage());
        }
    }
}
