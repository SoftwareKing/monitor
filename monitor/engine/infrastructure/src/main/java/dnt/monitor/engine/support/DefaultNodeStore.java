/**
 * Developer: Kadvin Date: 15/1/29 下午5:38
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.cache.CacheService;
import net.happyonroad.cache.MapContainer;
import net.happyonroad.event.*;
import net.happyonroad.model.Category;
import net.happyonroad.model.Record;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.DiffUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static net.happyonroad.support.BinarySupport.parseBinary;
import static net.happyonroad.support.BinarySupport.toBinary;

/**
 * <h1>缺省的管理节点存储器</h1>
 *
 * Node Store里面存储的原则为：
 * <ol>
 * <li> 仅存储对本引擎有影响的node
 * <li> 根节点, infrastructure 节点在每个节点都有
 * <li> 每个节点仅存储其自身信息，不与父节点进行合并
 * </ol>
 * 任何一个资源节点的变更，都只会影响到其相应资源监控任务
 * 任何一个群组节点的变更，都会影响到所有其下的资源的监控任务
 *
 * 当下以 redis hash为存储形态
 */
@Component
@ManagedResource("dnt.monitor.engine:type=store,name=nodeStore")
public class DefaultNodeStore extends ApplicationSupportBean implements NodeStore {
    @Autowired
    CacheService cacheService;

    // path -> node
    MapContainer container;
    Map<String, ManagedNode> nodes;

    @Override
    protected void performStart() {
        super.performStart();
        container = cacheService.getMapContainer(getClass().getSimpleName());
        nodes = new HashMap<String, ManagedNode>();
        //暂时这里的resource node实例，并不与resource直接关联
        //所以，无需等到资源被加载
        for (String path : container.keys()) {
            byte[] bytes = container.getBinary(path);
            if (bytes != null) {
                ManagedNode node = parseBinary(bytes, ManagedNode.class);
                nodes.put(path, node);
            }
        }
    }

    @Override
    public ManagedNode findByPath(String path) {
        logger.debug("Finding  managed node by path: {}", path);
        ManagedNode node = nodes.get(path);
        if (node != null) {
            String parentPath = Category.parentOf(path);
            //肯定没有根节点
            if (!ManagedNode.ROOT_PATH.equals(parentPath)) {
                ManagedNode parent = findByPath(parentPath);
                if (parent != null ){
                    node.merge(parent);
                }
            }
        }
        logger.debug("Found    {}", node);
        return node;
    }

    @Override
    public ResourceNode findByResourceId(Long id) {
        logger.debug("Finding  managed node by id: {}", id);
        for(ManagedNode node : nodes.values()){
            if( node instanceof ResourceNode ){
                ResourceNode resourceNode = (ResourceNode) node;
                if( id.equals(resourceNode.getResourceId()) ){
                    logger.debug("Found    {}", node);
                    return resourceNode;
                }
            }
        }
        logger.debug("Found    nothing");
        return null;
    }

    @Override
    public void add(ManagedNode node) {
        logger.info("Adding {}", node);
        publishEvent(new ObjectCreatingEvent<ManagedNode>(node));
        try {
            nodes.put(node.getPath(), node);
            container.put(node.getPath(), toBinary(node));
        } catch (RuntimeException e) {
            logger.error("Failed to add {}, because of {}", node, e.getMessage());
            publishEvent(new ObjectCreateFailureEvent<ManagedNode>(node, e));
            throw e;
        }
        publishEvent(new ObjectCreatedEvent<ManagedNode>(node));
        logger.info("Added  {}", node);
    }

    @Override
    public void update(ManagedNode exist, ManagedNode node) {
        logger.info("Updating {} to {}", exist, node);
        publishEvent(new ObjectUpdatingEvent<ManagedNode>(exist, node));
        try {
            nodes.put(node.getPath(), node);
            container.put(node.getPath(), toBinary(node) );
        } catch (RuntimeException e) {
            logger.error("Failed to update {}, because of {}", node, e.getMessage());
            publishEvent(new ObjectUpdateFailureEvent<ManagedNode>(exist, node, e));
            throw e;
        }
        publishEvent(new ObjectUpdatedEvent<ManagedNode>(node, exist));
        if( logger.isInfoEnabled() ){
            logger.info("Updated  {} by {}", exist, DiffUtils.describeDiff(exist, node, Record.HELP_ATTRS));
        }
    }

    @Override
    public void remove(String path) {
        ManagedNode node = findByPath(path);
        if( node == null ){
            logger.warn("There is no node at {}", path);
            return;
        }
        logger.warn("Removing {}", path);
        publishEvent(new ObjectDestroyingEvent<ManagedNode>(node));
        try {
            nodes.remove(path);
            container.remove(path);
        } catch (RuntimeException e) {
            logger.error("Failed to remove {}, because of {}", path, e.getMessage());
            publishEvent(new ObjectDestroyFailureEvent<ManagedNode>(node, e));
            throw e;
        }
        publishEvent(new ObjectDestroyedEvent<ManagedNode>(node));
        logger.warn("Removed  {}", path);
    }

    @Override
    public <T extends ManagedNode> T merge(T node) {
        T merged;
        try {
            //noinspection unchecked
            merged = (T)node.clone();
        } catch (CloneNotSupportedException e) {
            throw new IllegalStateException("Can't clone node", e);
        }
        String parentPath = merged.getParentPath();
        while(parentPath != null ){
            ManagedNode parent = findByPath(parentPath);
            merged.merge(parent);
            parentPath = Category.parentOf(parentPath);
        }
        return merged;
    }

    @ManagedAttribute(description = "当前采集引擎中存储的节点数量")
    public long getSize(){
        return container.size();
    }
}
