/**
 * Developer: Kadvin Date: 15/1/14 上午9:58
 */
package dnt.monitor.server.handler.resource;

import com.google.common.collect.MapDifference;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.Resource;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.DiffUtils;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * <h1>当资源被更新后，同步其相应管理节点</h1>
 */
@Component
class UpdateNodeAfterResourceUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<Resource>> {
    @Autowired
    NodeService nodeService;

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<Resource> event) {
        Resource resource = event.getLegacySource();
        if( resource instanceof MonitorEngine) {
            //监控引擎的处理与一般资源不同，由 EngineEventsHandler 处理
            //这里只处理一般性的资源
            return;
        }
        Resource update = (Resource) ((ObjectUpdatedEvent) event).getSource();
        if(update.isCascadeUpdating()) return;
        autoUpdateNodeForResource(resource, update);
    }

    // 当资源的某些关键属性变化，导致管理节点某些属性
    // 需要变更的时候，就应该在这里处理该逻辑
    // 典型的情况如，某个资源的地址属性变化了，其对应的管理节点的path属性也需要调整
    // 且在这里处理时，也应该为 node 设置 cascadeUpdating
    void autoUpdateNodeForResource(Resource oldResource, Resource newResource) {
        logger.info("Heard {} updated as {}", oldResource, newResource);
        MapDifference<String, Object> differences = DiffUtils.difference(oldResource, newResource);
        Map<String, MapDifference.ValueDifference<Object>> diff = differences.entriesDiffering();
        ManagedNode node = nodeService.findByResourceId(newResource.getId());
        ManagedNode newNode;
        try {
            newNode = (ManagedNode) node.clone();
        } catch (CloneNotSupportedException e) {
            throw new IllegalStateException("Can't clone managed node", e);
        }
        boolean update = false;
        //如果资源的label变化了
        if( diff.containsKey("label") ){
            //如果节点的当前label与资源的原始label一样，也就是并未被用户设置过
            // 那么现在也进行更新
            if(StringUtils.equals(node.getLabel(), oldResource.getLabel())){
                newNode.setLabel(newResource.getLabel());
                update = true;
            }
        }
        if( oldResource.getClass() != newResource.getClass()){
            //更新图标
            newNode.setIcon(mappingIcon(newResource));
            update = true;
        }
        if( update ) try {
            nodeService.update(node, newNode);
        } catch (Exception e) {
            logger.error("Can't update label for " + node +
                         ", because of " + MiscUtils.describeException(e), e);
        }
    }


    // 与 CreateNodeAfterResourceCreated重复
    private String mappingIcon(Resource resource) {
        //TODO enhance dynamic mapping or meta info
        if(net.happyonroad.util.StringUtils.equalsIgnoreCase(resource.getType(), "/device/host/linux")) {
            return "linux";
        }else if(net.happyonroad.util.StringUtils.equalsIgnoreCase(resource.getType(), "/device/host/windows")){
            return "windows";
        }else if(net.happyonroad.util.StringUtils.equalsIgnoreCase(resource.getType(), "/device/switch")){
            return "switch3";
        }
        return "device";
    }
}
