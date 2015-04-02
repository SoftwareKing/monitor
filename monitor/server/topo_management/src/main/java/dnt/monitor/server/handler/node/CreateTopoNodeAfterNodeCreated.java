/**
 * Developer: Kadvin Date: 15/1/14 下午1:59
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.model.Category;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>监听Node对象的事件，并同步成为Topo(node/map)对象</h1>
 * <ul>
 * <li> 新的Node创建后，根据其类型，应该为其创建相应的TopoNode/Map/Link
 * </ul>
 * 一个Node，他可能以多种Topo对象形态存在，如，一个IP Range对象
 * <ul>
 * <li>它既要作为上级Map的TopoNode存在
 * <li>又要作为下级对象的TopoMap对象存在
 * </ul>
 * 未来，如果某个对象存在多个map，那么其下某个资源创建出来后，所有的map下面都应该有相应的topo对象
 */
@Component
class CreateTopoNodeAfterNodeCreated extends Bean
        implements ApplicationListener<ObjectCreatedEvent<ManagedNode>> {
    @Autowired
    TopoService topoService;

    public CreateTopoNodeAfterNodeCreated() {
        setOrder(100);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<ManagedNode> event) {
        ManagedNode node = event.getSource();
        try {
            autoCreateTopoForNode(node);
        } catch (TopoException e) {
            throw new ApplicationContextException("Can't create node from management layer to topo layer", e);
        }
    }

    void autoCreateTopoForNode(ManagedNode node) throws TopoException {
        if( node instanceof ResourceNode){
            // Resource
            autoCreateTopoNodes(node);
        }else{
            autoCreateTopoMapAndTopoNodes(node);
        }
    }
    /**
     * 自动为某个管理节点创建相应的TopoNode
     *
     * @param node 管理节点
     */
    private void autoCreateTopoNodes(ManagedNode node) {
        try {
            String nodePath = node.getPath();
            String parentPath = Category.parentOf(nodePath);
            //新建的TopoNode对象不设置坐标和尺寸，意味着客户端应该自行决定如何布局
            TopoNode topoNode = new TopoNode();
            topoNode.setNode(node);
            topoNode.setPath(nodePath);
            topoNode.setLeaf(node instanceof ResourceNode);
            topoNode.setLabel(node.getLabel());
            topoNode.setIcon(node.getIcon());

            TopoMap map = topoService.findMapByPath(parentPath);
            topoService.createNode(map, topoNode);
        } catch (Exception e) {
            logger.warn("Failed to auto create topo node", e);
        }
    }

    private void autoCreateTopoMapAndTopoNodes(ManagedNode node) throws TopoException {
        if( !node.getPath().equals("/")){
            //不是根节点，先将本节点作为上级map的TopoNode
            autoCreateTopoNodes(node);
        }
        //再为本节点创建TopoMap对象，去容纳自己的下级节点
        TopoMap map = new TopoMap();
        map.setNode(node);
        map.setPath(node.getPath());
        map.setLabel(node.getLabel());
        map.setScale(1.0f);
        topoService.createMap(map);
    }

}
