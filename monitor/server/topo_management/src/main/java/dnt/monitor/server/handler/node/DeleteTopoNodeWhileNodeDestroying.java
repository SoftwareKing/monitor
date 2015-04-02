/**
 * Developer: Kadvin Date: 15/1/14 下午1:59
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>删除管理节点时，先删除topo节点</h1>
 */
@Component
class DeleteTopoNodeWhileNodeDestroying extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<ManagedNode>> {
    @Autowired
    TopoService topoService;

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<ManagedNode> event) {
        try {
            autoDeleteTopoForNode(event.getSource());
        } catch (TopoException e) {
            throw new ApplicationContextException("Can't delete topo node for management layer", e);

        }
    }

    //根据 Node Manager的实现逻辑，Node的删除是从叶子节点向上逐层删除
    //  这里也会逐层听到删除事件，不会（也不应该）在还有Topo子节点的时候就听到上级节点被删除的事件
    //  所以，这里只需要删除node对应的topo node/map即可
    void autoDeleteTopoForNode(ManagedNode node) throws TopoException {

        if(!(node instanceof ResourceNode)) {
            topoService.deleteMap(node.getPath());
        }
        topoService.deleteNode(node.getPath());
    }
}
