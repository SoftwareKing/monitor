/**
 * Developer: Kadvin Date: 15/3/9 下午7:11
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>删除引擎之前，检查其监控范围内是否有被监控资源</h1>
 */
@Component
public class AntiDeleteEngineWithNotEmptyScope extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<ResourceNode>> {
    @Autowired
    NodeService nodeService;

    public AntiDeleteEngineWithNotEmptyScope() {
        // Before others
        setOrder(5);
    }

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<ResourceNode> event) {
        ResourceNode node = event.getSource();
        if( node.isEngineNode() ){
            MonitorEngine engine = (MonitorEngine) node.getResource();
            String scopePath = engine.getScopePath();
            //此时scope node可能已经被删除了
            ManagedNode scopeNode = nodeService.findByPath(scopePath);
            List<ManagedNode> children = nodeService.findSubNodes(scopeNode, 2, true);
            if (children.size() > 1) {
                throw new UnsupportedOperationException("Can't delete engine which monitor scope with other nodes: "
                        + StringUtils.join(children, ","));
            }
        }

    }
}
