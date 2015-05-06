package dnt.monitor.engine.support;

import dnt.monitor.engine.service.ResourceStore;
import dnt.monitor.model.Device;
import dnt.monitor.model.Resource;
import net.happyonroad.cache.CacheService;
import net.happyonroad.cache.MapContainer;
import net.happyonroad.event.*;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.model.Record;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.DiffUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static net.happyonroad.support.BinarySupport.parseBinary;
import static net.happyonroad.support.BinarySupport.toBinary;

/**
 * <h1>缺省的资源存储器</h1>
 *
 * @author Jay Xiong
 */
@Component
@ManagedResource("dnt.monitor.engine:type=store,name=resourceStore")
public class DefaultResourceStore extends ApplicationSupportBean
        implements ResourceStore, ApplicationListener<SystemStartedEvent> {
    @Autowired
    CacheService cacheService;
    @Autowired
    GlobalClassLoader classLoader;

    //id -> Resource
    MapContainer container;
    Map<Long, Resource> resources;
    long minId = 0;

    public DefaultResourceStore() {
        setOrder(100);
    }

    //必须等到系统启动之后，所有扩展组件已经加载之后，才能顺利的将各种资源解析出来
    // 否则无法识别资源的class
    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        container = cacheService.getMapContainer(getClass().getSimpleName());
        resources = new HashMap<Long, Resource>();
        ClassLoader legacy = Thread.currentThread().getContextClassLoader();
        try{
            //for parseBinary
            Thread.currentThread().setContextClassLoader(classLoader);
            for (String strId : container.keys()) {
                Long id;
                try {
                    id = Long.valueOf(strId);
                } catch (NumberFormatException e) {
                    logger.error("Can't parse resource with id = {}, skip it", strId);
                    continue;
                }
                byte[] bytes = container.getBinary(strId);
                if (bytes != null) {
                    Resource resource = parseBinary(bytes, Resource.class);
                    resources.put(id, resource);
                }
                minId = Math.min(minId, id);
            }
        }finally {
            Thread.currentThread().setContextClassLoader(legacy);
        }
    }

    @Override
    public Resource findByAddress(String address) {
        logger.debug("Finding  device by address {}", address);
        for (Resource resource : resources.values()) {
            if( address.equals(resource.getAddress())){
                logger.debug("Found   {}", resource);
                return resource;
            }
        }
        return null;
    }

    @Override
    public Resource findById(Long resourceId) {
        logger.debug("Finding  resource by id {}", resourceId);
        Resource resource = resources.get(resourceId);
        if( resource != null )
        {
            logger.debug("Found    {}", resource);
            return resource;
        }
        throw new IllegalArgumentException("Can't find resource with id = " + resourceId);
    }

    @Override
    public void add(Resource resource) {
        logger.info("Adding {}", resource);
        //存储尚未被设置id的临时设备
        if( resource.getId() == null ){
            resource.setId(minId--);
        }
        publishEvent(new ObjectCreatingEvent<Resource>(resource));
        try {
            //移除已经存在的临时设备
            if( resource instanceof Device){
                Device device = (Device) findByAddress(resource.getAddress());
                if( device != null && device.getId() < 0 ){
                    logger.debug("Remove temp device {} with negative id: {}", device, device.getId());
                    resources.remove(device.getId());
                    container.remove(String.valueOf(device.getId()));
                }
            }
            resources.put(resource.getId(), resource);
            container.put(String.valueOf(resource.getId()), toBinary(resource));
        } catch (RuntimeException e) {
            logger.error("Failed to add {}, because of {}", resource, e.getMessage());
            publishEvent(new ObjectCreateFailureEvent<Resource>(resource, e));
            throw e;
        }
        publishEvent(new ObjectCreatedEvent<Resource>(resource));
        logger.info("Added  {}", resource);
    }

    @Override
    public void update(Resource exist, Resource resource) {
        logger.info("Updating {} to {}", exist, resource);
        publishEvent(new ObjectUpdatingEvent<Resource>(exist, resource));
        try {
            resources.put(resource.getId(), resource);
            container.put(String.valueOf(resource.getId()), toBinary(resource));
        } catch (RuntimeException e) {
            logger.error("Failed to update {}, because of {}", resource, e.getMessage());
            publishEvent(new ObjectUpdateFailureEvent<Resource>(exist, resource, e));
            throw e;
        }
        publishEvent(new ObjectUpdatedEvent<Resource>(resource, exist));
        if( logger.isInfoEnabled() ){
            String diffs = DiffUtils.describeDiff(exist, resource, Record.HELP_ATTRS);
            logger.info("Updated  {} by {}", exist, StringUtils.abbreviate(diffs, 100));
        }
    }

    @Override
    public void updateResourceId(Resource resource, Long resourceId) {
        logger.info("Change {} id from {} to {}", resource, resource.getId(), resourceId);
        remove(resource);
        resource.setId(resourceId);
        add(resource);
    }

    @Override
    public void remove(Resource resource) {
        logger.warn("Removing {}", resource );
        publishEvent(new ObjectDestroyingEvent<Resource>(resource));
        try {
            resources.remove(resource.getId());
            container.remove(resource.getId().toString());
        } catch (RuntimeException e) {
            logger.error("Failed to remove {}, because of {}", resource, e.getMessage());
            publishEvent(new ObjectDestroyFailureEvent<Resource>(resource, e));
            throw e;
        }
        publishEvent(new ObjectDestroyedEvent<Resource>(resource));
        logger.warn("Removed  {}", resource);
    }

    @ManagedAttribute(description = "当前采集引擎中存储的资源数量")
    public long getSize(){
        return container.size();
    }
}
