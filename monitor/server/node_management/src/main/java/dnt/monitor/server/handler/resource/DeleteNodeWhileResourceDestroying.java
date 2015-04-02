/**
 * Developer: Kadvin Date: 15/1/14 上午9:57
 */
package dnt.monitor.server.handler.resource;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.Resource;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>Aut delete node for resource</h1>
 */
@Component
class DeleteNodeWhileResourceDestroying extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<Resource>> {
    @Autowired
    NodeService nodeService;

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<Resource> event) {
        Resource resource = event.getSource();
        if( resource instanceof MonitorEngine) {
            //监控引擎的处理与一般资源不同，由 EngineEventsHandler 处理
            //这里只处理一般性的资源
            return;
        }
        autoDeleteNodeForResource(resource);
    }

    void autoDeleteNodeForResource(Resource resource) {
        ManagedNode node = nodeService.findByResourceId(resource.getId());
        if(node == null ){
            logger.debug("{} nodes has been deleted", resource);
            return;
        }
        try {
            //标记，说明这个node是资源删除时被级联删除的
            // 等其被删除后，不需要自动删除对应的资源
            node.cascadeDeleting();
            nodeService.delete(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't auto delete node " + node.getPath(), e);
        }
    }
}
