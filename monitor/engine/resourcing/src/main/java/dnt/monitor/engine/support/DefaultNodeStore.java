/**
 * Developer: Kadvin Date: 15/1/29 下午5:38
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.model.Device;
import dnt.monitor.model.ManagedNode;
import net.happyonroad.cache.CacheService;
import net.happyonroad.cache.MapContainer;
import net.happyonroad.event.*;
import net.happyonroad.model.Category;
import net.happyonroad.model.Record;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.DiffUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static net.happyonroad.support.BinarySupport.parseBinary;
import static net.happyonroad.support.BinarySupport.toBinary;

/**
 * <h1>缺省的管理节点存储器</h1>
 *
 * 当下以 redis hash为存储形态
 */
@Component
class DefaultNodeStore extends ApplicationSupportBean implements NodeStore {
    @Autowired
    CacheService cacheService;
    Map<String, ManagedNode> objects;

    private MapContainer container;

    @Override
    protected void performStart() {
        super.performStart();
        container = cacheService.getMapContainer(getClass().getSimpleName());
        objects = new HashMap<String, ManagedNode>();
        for(String path : container.keys()){
            byte[] bytes = container.getBinary(path);
            if( bytes != null ) {
                ManagedNode node = parseBinary(bytes, ManagedNode.class);
                objects.put(path, node);
            }
        }
    }

    @Override
    public ManagedNode findByPath(String path) {
        logger.debug("Finding  managed node by {}", path);
        ManagedNode node = objects.get(path);
        if( node != null ){
            String parentPath = Category.parentOf(path);
            //肯定没有根节点
            if(!ManagedNode.ROOT_PATH.equals(parentPath))
            {
                ManagedNode parent = findByPath(parentPath);
                if( parent != null ){
                    node.merge(parent);
                }
            }
        }
        logger.debug("Found    {}", node);
        return node;
    }

    @Override
    public void add(ManagedNode node) {
        logger.info("Adding {}", node);
        publishEvent(new ObjectCreatingEvent<ManagedNode>(node));
        try {
            objects.put(node.getPath(), node);
            container.put(node.getPath(), toBinary(node));
            logger.info("Added  {}", node);
        } catch (RuntimeException e) {
            logger.error("Failed to add {}, because of {}", node, e.getMessage());
            publishEvent(new ObjectCreateFailureEvent<ManagedNode>(node, e));
            throw e;
        }
        publishEvent(new ObjectCreatedEvent<ManagedNode>(node));
    }

    @Override
    public void update(ManagedNode exist, ManagedNode node) {
        logger.info("Updating {} to {}", exist, node);
        publishEvent(new ObjectUpdatingEvent<ManagedNode>(exist, node));
        try {
            objects.put(node.getPath(), node);
            container.put(node.getPath(), toBinary(node) );
            if( logger.isInfoEnabled() ){
                logger.info("Updated  {} by {}", exist, DiffUtils.describeDiff(exist, node, Record.HELP_ATTRS));
            }
        } catch (RuntimeException e) {
            logger.error("Failed to update {}, because of {}", node, e.getMessage());
            publishEvent(new ObjectUpdateFailureEvent<ManagedNode>(exist, node, e));
            throw e;
        }
        publishEvent(new ObjectUpdatedEvent<ManagedNode>(node, exist));
    }

    @Override
    public void remove(ManagedNode node) {
        logger.warn("Removing {}", node );
        publishEvent(new ObjectDestroyingEvent<ManagedNode>(node));
        try {
            objects.remove(node.getPath());
            container.remove(node.getPath());
            logger.warn("Removed  {}", node);
        } catch (RuntimeException e) {
            logger.error("Failed to remove {}, because of {}", node, e.getMessage());
            publishEvent(new ObjectDestroyFailureEvent<ManagedNode>(node, e));
            throw e;
        }
        publishEvent(new ObjectDestroyedEvent<ManagedNode>(node));
    }
}
