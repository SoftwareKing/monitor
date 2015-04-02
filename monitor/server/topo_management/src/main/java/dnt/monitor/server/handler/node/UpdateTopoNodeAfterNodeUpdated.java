/**
 * Developer: Kadvin Date: 15/1/14 下午1:59
 */
package dnt.monitor.server.handler.node;

import com.google.common.collect.MapDifference;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.DiffUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * <h1>监听Node对象的事件，并同步到TopoMap/Node上</h1>
 *
 * 注意：现在仅做Path的更新同步
 */
@Component
class UpdateTopoNodeAfterNodeUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<ManagedNode>> {
    @Autowired
    TopoService topoService;

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<ManagedNode> event) {
        ManagedNode node = event.getLegacySource();
        try {
            ManagedNode newNode = event.getSource();
            autoUpdateTopoForNode(node, newNode);
        } catch (TopoException e) {
            throw new ApplicationContextException("Can't update node from management layer to topo layer", e);
        }
    }

    void autoUpdateTopoForNode(ManagedNode node, ManagedNode newNode) throws TopoException{
        String legacyPath = node.getPath();
        String newPath = newNode.getPath();
        if(!StringUtils.equals(legacyPath, newPath)){
            logger.info("Heard node path changed from {} to {}", legacyPath,  newPath);
            topoService.updatePath(legacyPath, newPath);
        }else{
            logger.info("Heard {} updated as {}", node, newNode);
            MapDifference<String, Object> differences = DiffUtils.difference(node, newNode);
            Map<String, MapDifference.ValueDifference<Object>> diff = differences.entriesDiffering();
            //如果资源的label变化了
            if( diff.containsKey("label") || diff.containsKey("icon")){
                TopoNode topoNode = topoService.findNodeByPath(newPath);
                TopoNode newTopoNode;
                try {
                    newTopoNode = (TopoNode) topoNode.clone();
                } catch (CloneNotSupportedException e) {
                    throw new TopoException("Can't clone " +  topoNode);
                }
                newTopoNode.setLabel(newNode.getLabel());
                newTopoNode.setIcon(newNode.getIcon());
                topoService.updateNode(topoNode, newTopoNode);
            }


        }
    }

}
