/**
 * Developer: Kadvin Date: 14/12/28 上午11:34
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Link;
import dnt.monitor.model.LinkType;
import dnt.monitor.model.Resource;
import dnt.monitor.server.resolver.ServerFeatureResolver;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.ResourceService;
import dnt.monitor.server.service.ServiceLocator;
import dnt.monitor.server.service.ServiceRegistry;
import dnt.monitor.service.*;
import net.happyonroad.component.container.ComponentLoader;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.spring.Bean;
import org.apache.commons.lang.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * <h1>The resource service manager</h1>
 */
@Component
class ServiceManager extends Bean
        implements ServiceLocator, ServiceRegistry,
                   ApplicationListener<SystemStartedEvent> {
    @Autowired
    ComponentLoader componentLoader;
    @Autowired
    @Qualifier("linkManager")
    LinkService     linkService;

    @Autowired
    CategoryService categoryService;
    @Autowired
    MetaService     metaService;

    private Map<String, ResourceService> resourceServices;
    private Map<String, LinkService>     linkServices;

    public ServiceManager() {
        resourceServices = new HashMap<String, ResourceService>();

        linkServices = new HashMap<String, LinkService>();
    }

    @Override
    protected void performStart() {
        super.performStart();
        ServerFeatureResolver resolver = componentLoader.getFeatureResolver(ServerFeatureResolver.FEATURE);
        if (resolver != null) {
            resolver.setCategoryService(categoryService);
            resolver.setMetaService(metaService);
        }
        for (LinkType type : LinkType.values()) {
            linkServices.put(type.name(), linkService);
        }
        //以后有自己实现link管理类的，自行注册
    }

    @Override
    public <X extends ResourceService> void register(String type, X resourceService) throws ResourceException {
        Validate.notEmpty(type, "The resource type can't be null");
        Validate.notNull(resourceService, "The resource service can't be null");
        ResourceService exist = resourceServices.get(type);
        if (exist != null)
            throw new ResourceException("There is resource service " +
                                        exist + " for " + type +
                                        ", reject your " + resourceService);
        resourceServices.put(type, resourceService);
    }

    @Override
    public ResourceService locate(Resource resource) throws ResourceException {
        String type = resource.getType();
        return locateResourceService(type);
    }

    public ResourceService locateResourceService(String type) throws ResourceException {
        if (type == null)
            throw new ResourceException("You should specify the resource type");
        ResourceService service = resourceServices.get(type);
        //  如果找不到本级资源的管理器，是不是应该找上级资源？
        if (service == null){
            String parentType = net.happyonroad.model.Category.parentOf(type);
            logger.debug("This is no resource service register for " + type + ", try parent: " + parentType);
            return locateResourceService(parentType);
        }
        return service;
    }

    @Override
    public LinkService locate(Link link) throws ResourceException {
        return locateLinkService(link.getType());
    }

    @Override
    public LinkService locateLinkService(String type) throws ResourceException {
        return linkServices.get(type);
    }

    // 容器启动未必，所有的
    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        ServerFeatureResolver resolver = componentLoader.getFeatureResolver(ServerFeatureResolver.FEATURE);
        List<ResourceService> services = resolver.getResourceServices();
        for (ResourceService service : services) {
            try {
                String type = categoryService.resolveType(service.getResourceType());
                register(type, service);
            } catch (Exception e) {
                throw new ApplicationContextException("Can't find resource type for resource", e);
            }
        }
    }

}
