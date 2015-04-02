/**
 * Developer: Kadvin Date: 15/1/14 下午12:59
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.ResourceService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectCreatingEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>为资源节点创建对应的资源</h1>
 * 当用户通过界面创建资源节点时，如果对应的资源尚未被建立，则先创建资源对象
 */
@Component
class CreateResourceWhileNodeCreating extends Bean
        implements ApplicationListener<ObjectCreatingEvent<ResourceNode>> {
    @Autowired
    ServiceLocator serviceLocator;

    @Override
    public void onApplicationEvent(ObjectCreatingEvent<ResourceNode> event) {
        ResourceNode node = event.getSource();
        try {
            autoCreateResourceOfNode(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't create resource of node", e );
        }
    }

    void autoCreateResourceOfNode(ResourceNode node) throws NodeException {
        Resource resource = node.getResource();
        if (resource == null)
            throw new IllegalArgumentException("You must specify resource information for resource node");
        if (resource.isNew()) {
            resource.cascadeCreating();
            if (StringUtils.isNotBlank(resource.getAddress()) && StringUtils.isBlank(resource.getLabel())) {
                resource.setLabel(resource.getAddress());
            }
            if (StringUtils.isNotBlank(node.getLabel()) && StringUtils.isBlank(resource.getLabel())) {
                resource.setLabel(node.getLabel());
            }

            ResourceService service;
            try {
                service = serviceLocator.locate(resource);
            } catch (ResourceException e) {
                throw new NodeException("Can't find the resource service", e);
            }
            try {
                //noinspection unchecked
                Resource created = service.create(resource);
                node.setResource(created);
            } catch (ResourceException e) {
                throw new NodeException("Can't create managed node, because failed to create underlying resource", e);
            }
        }
    }

}
