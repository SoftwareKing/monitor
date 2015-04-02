/**
 * Developer: Kadvin Date: 15/1/27 下午9:20
 */
package dnt.monitor.server.handler.node;

import com.google.common.collect.MapDifference;
import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.ResourceService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectUpdatingEvent;
import net.happyonroad.model.Record;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.DiffUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>当指向资源的管理节点被更新时，为其更新资源信息</h1>
 * 当用户(管理员)更新管理节点时，如果其资源节点被修改了，则首先更新之
 */
@Component
class UpdateResourceWhileNodeUpdating extends Bean
        implements ApplicationListener<ObjectUpdatingEvent<ResourceNode>> {
    @Autowired
    ServiceLocator serviceLocator;

    @Override
    public void onApplicationEvent(ObjectUpdatingEvent<ResourceNode> event) {
        ResourceNode node = event.getUpdating();
        try {
            autoUpdateResourceOfNode(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't update resource of node", e);
        }

    }

    void autoUpdateResourceOfNode(ResourceNode node) throws NodeException {
        Resource resource = node.getResource();
        if (resource == null) return;
        ResourceService service;
        try {
            service = serviceLocator.locate(resource);
        } catch (ResourceException e) {
            throw new NodeException("Can't find the resource service", e);
        }
        try {
            Resource legacy = service.findById(resource.getId());
            MapDifference<String, Object> differences = DiffUtils.difference(legacy, resource, Record.HELP_ATTRS);
            if( !differences.areEqual() ){
                resource.cascadeUpdating();
                Resource updated = service.update(legacy, resource);
                node.setResource(updated);
            }
        } catch (ResourceException e) {
            throw new NodeException("Can't create managed node, because failed to create resource", e);
        }


    }
}
