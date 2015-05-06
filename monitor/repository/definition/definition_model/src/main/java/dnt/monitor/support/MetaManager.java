/**
 * Developer: Kadvin Date: 15/2/4 下午4:33
 */
package dnt.monitor.support;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.*;
import dnt.monitor.model.*;
import dnt.monitor.resolver.ModelFeatureResolver;
import dnt.monitor.service.CategoryService;
import dnt.monitor.service.MetaResolver;
import dnt.monitor.service.MetaService;
import net.happyonroad.component.container.ComponentLoader;
import net.happyonroad.model.Category;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jmx.export.annotation.ManagedResource;

import java.util.*;

/**
 * <h1>元模型管理器</h1>
 */
@org.springframework.stereotype.Component
@SuppressWarnings("unchecked")
class MetaManager extends ApplicationSupportBean implements MetaService {
    @Autowired
    ComponentLoader componentLoader;

    // 三种主要的解析器
    @Autowired
    @Qualifier("metaResourceResolver")
    MetaResolver<Resource, MetaResource<Resource>>    metaResourceResolver;
    @Autowired
    @Qualifier("metaComponentResolver")
    MetaResolver<Component, MetaComponent<Component>> metaComponentResolver;
    @Autowired
    @Qualifier("metaLinkResolver")
    MetaResolver<Link, MetaLink<Link>>                metaLinkResolver;
    @Autowired
    @Qualifier("metaEntryResolver")
    MetaResolver<Entry, MetaEntry<Entry>>              metaEntryResolver;

    // 解析出来的元模型
    private Map<Class, MetaResource>  resourceModels  = new LinkedHashMap<Class, MetaResource>();
    private Map<Class, MetaComponent> componentModels = new LinkedHashMap<Class, MetaComponent>();
    private Map<Class, MetaLink>      linkModels      = new LinkedHashMap<Class, MetaLink>();
    private Map<Class, MetaEntry>     entryModels     = new LinkedHashMap<Class, MetaEntry>();

    @Autowired
    CategoryService categoryService;

    @Override
    protected void performStart() {
        super.performStart();
        ModelFeatureResolver resolver = componentLoader.getFeatureResolver(ModelFeatureResolver.FEATURE);
        if (resolver != null) {
            resolver.setMetaService(this);
        }
    }

    /**
     * 由 Model Feature Resolver回调的解析入口方法
     *
     * @param klass    被解析的资源类
     */
    public MetaModel resolve(Class klass) throws MetaException {
        try {
            return meta(klass);
        } catch (IllegalArgumentException e) {
            //fresh model, going on resolve
        }
        if (Resource.class.isAssignableFrom(klass)) {
            Class<Resource> type = (Class<Resource>) klass;
            return metaResourceResolver.resolve(type);
        } else if (Component.class.isAssignableFrom(klass)) {
            Class<Component> type = (Class<Component>) klass;
            return metaComponentResolver.resolve(type);
        } else if (Link.class.isAssignableFrom(klass)) {
            Class<Link> type = (Class<Link>) klass;
            return metaLinkResolver.resolve(type);
        } else if (Entry.class.isAssignableFrom(klass)) {
            Class<Entry> type = (Class<Entry>) klass;
            return metaEntryResolver.resolve(type);
        }else if( klass == ManagedObject.class ){
            logger.debug("Skip ManagedObject");
            return null;
        }else {
            throw new IllegalArgumentException("Do not support resolve meta model of " + klass.getName());
        }
    }

    @Override
    public void register(MetaModel metaModel) throws MetaException {
        if (metaModel instanceof MetaResource) {
            registerModel((MetaResource) metaModel);
        } else if (metaModel instanceof MetaComponent) {
            registerModel((MetaComponent) metaModel);
        } else if (metaModel instanceof MetaLink) {
            registerModel((MetaLink) metaModel);
        } else if (metaModel instanceof MetaEntry) {
            registerModel((MetaEntry) metaModel);
        } else {
            throw new MetaException("Don't support register pure managed object model " +
                                    "or other models besides resource,component,link");
        }
        registerMbean(metaModel, metaModel.getObjectName());
    }

    @Override
    public void unregister(MetaModel metaModel) {
        if (metaModel instanceof MetaResource) {
            resourceModels.remove(metaModel.getModelClass());
        } else if (metaModel instanceof MetaComponent) {
            componentModels.remove(metaModel.getModelClass());
        } else if (metaModel instanceof MetaLink) {
            linkModels.remove(metaModel.getModelClass());
        } else {
            logger.warn("Unregister not recognized meta model {}", metaModel);
        }
    }

    void registerModel(MetaResource model) throws MetaException {
        MetaResource exist = resourceModels.get(model.getModelClass());
        if (exist != null)
            throw new MetaException("There is a resource model named as " + model.getName());
        logger.debug("Found {}", model);
        resourceModels.put(model.getModelClass(), model);
    }

    void registerModel(MetaComponent model) throws MetaException {
        MetaComponent exist = componentModels.get(model.getModelClass());
        if (exist != null)
            throw new MetaException("There is a component model named as " + model.getName());
        logger.debug("Found {}", model);
        componentModels.put(model.getModelClass(), model);
    }

    void registerModel(MetaLink model) throws MetaException {
        MetaLink exist = linkModels.get(model.getModelClass());
        if (exist != null)
            throw new MetaException("There is a link model named as " + model.getName());
        logger.debug("Found {}", model);
        linkModels.put(model.getModelClass(), model);
    }

    void registerModel(MetaEntry model) throws MetaException {
        MetaEntry exist = entryModels.get(model.getModelClass());
        if (exist != null)
            throw new MetaException("There is a entry model named as " + model.getName());
        logger.debug("Found {}", model);
        entryModels.put(model.getModelClass(), model);
    }

    //////////////////////////////////////////////////////////////////
    // Find models
    //////////////////////////////////////////////////////////////////

    @Override
    public <Meta extends MetaModel> Meta meta(Class klass) throws MetaException {
        if (dnt.monitor.model.Component.class.isAssignableFrom(klass)) {
            Class<? extends dnt.monitor.model.Component> c = (Class<? extends dnt.monitor.model.Component>) klass;
            return (Meta) getMetaComponent(c);
        } else if (Entry.class.isAssignableFrom(klass)) {
            Class<? extends Entry> c = (Class<? extends Entry>) klass;
            return (Meta) getMetaEntry(c);
        } else if (Link.class.isAssignableFrom(klass)) {
            Class<? extends Link> c = (Class<? extends Link>) klass;
            return (Meta) getMetaLink(c);
        } else if (Resource.class.isAssignableFrom(klass)) {
            Class<? extends Resource> c = (Class<? extends Resource>) klass;
            return (Meta) getMetaResource(c);
        } else if (klass == ManagedObject.class) {
            return null;
        } else
            throw new IllegalArgumentException("The managed object class " + klass.getName() + " is invalid");
    }

    @Override
    public MetaResource getMetaResource(Class<? extends Resource> type) {
        MetaResource metaResource = resourceModels.get(type);
        if( metaResource == null )
            throw new IllegalArgumentException("Can't find MetaResource of " + type.getName() );
        return metaResource;
    }

    @Override
    public List<MetaResource> getMetaResources() {
        ArrayList<MetaResource> metaResources = new ArrayList<MetaResource>(resourceModels.values());
        Collections.sort(metaResources);
        return metaResources;
    }

    @Override
    public MetaResource getMetaResource(String type) {
        for (MetaResource metaResource : resourceModels.values()) {
            if(StringUtils.equals(metaResource.getName(), type) ){
                return metaResource;
            }
        }
        return null;
    }

    @Override
    public MetaComponent getMetaComponent(Class<? extends dnt.monitor.model.Component> type) {
        MetaComponent metaComponent = componentModels.get(type);
        if( metaComponent == null )
            throw new IllegalArgumentException("Can't find MetaComponent of " + type.getName() );
        return metaComponent;
    }

    @Override
    public MetaEntry getMetaEntry(Class<? extends Entry> type) {
        MetaEntry metaEntry = entryModels.get(type);
        if( metaEntry == null )
            throw new IllegalArgumentException("Can't find MetaEntry of " + type.getName() );
        return metaEntry;
    }

    @Override
    public MetaLink getMetaLink(Class<? extends Link> type) {
        MetaLink metaLink = linkModels.get(type);
        if( metaLink == null )
            throw new IllegalArgumentException("Can't find MetaLink of " + type.getName() );
        return metaLink;
    }

    @Override
    public Set<MetaResource> getMetaResources(String category) {
        if (StringUtils.isBlank(category))
            throw new IllegalArgumentException("The category must be provided!");
        Category theCategory = categoryService.parseCategory(category);

        Set<MetaResource> models = new LinkedHashSet<MetaResource>();
        for (MetaResource resourceModel : resourceModels.values()) {
            //如果这个资源模型没定义类别，说明其是一些辅助的中间模型
            if (StringUtils.isBlank(resourceModel.getName())) continue;
            // category = host
            //  resource model = host.linux
            //  resource model = host.windows
            // category = network.router
            //  resource model = network
            //  resource model = network.router
            if (theCategory.includes(resourceModel.getName())) {
                models.add(resourceModel);
            }
        }
        return models;
    }
}
