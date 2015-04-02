/**
 * Developer: Kadvin Date: 15/1/13 下午9:30
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.*;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.ResourceService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectDestroyedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>管理节点被删除后，资源节点也随之删除</h1>
 */
@Component
class CleanResourceAfterNodeDestroyed extends Bean
        implements ApplicationListener<ObjectDestroyedEvent<ResourceNode>> {
    @Autowired
    ServiceLocator serviceLocator;
    @Autowired
    LinkService<Link> linkService;

    @Override
    public void onApplicationEvent(ObjectDestroyedEvent<ResourceNode> event) {
        ResourceNode node = event.getSource();
        if( node.isCascadeDeleting())
        {
            // 这个节点是在资源删除时被级联删除的，不需要自动删除其资源
            logger.debug("The node is deleted by resource deletion");
            return;
        }
        // 这里需要 node.resource 也必须在上一层查询结果中
        Resource resource = node.getResource();
        boolean force = "true".equals(node.getProperty("forceDeletion"));
        List<Link> links = linkService.findLinksOf(resource);
        if( force && !links.isEmpty() ){
            for (Link link : links) {
                try {
                    linkService.unlink(link);
                } catch (ResourceException e) {
                    throw new ApplicationContextException("Can't auto delete link " + link , e);
                }
            }
        }
        ResourceService<Resource> service;
        try {
            //noinspection unchecked
            service = serviceLocator.locate(resource);
        } catch (ResourceException e) {
            throw new ApplicationContextException("Can't find the resource service", e);
        }
        try {
            resource.cascadeDeleting();
            service.delete(resource);
        } catch (ResourceException e) {
            throw new ApplicationContextException("Can't delete the resource", e);
        }

    }
}
