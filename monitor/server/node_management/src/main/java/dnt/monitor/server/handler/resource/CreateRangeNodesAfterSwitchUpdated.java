package dnt.monitor.server.handler.resource;

import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.model.Category;
import net.happyonroad.model.SubnetRange;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.State;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>监听交换机创建事件，为其子网创建管理节点</h1>
 * @author Jay Xiong
 */
@Component
public class CreateRangeNodesAfterSwitchUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<Switch>>{
    @Autowired
    NodeService nodeService;

    public CreateRangeNodesAfterSwitchUpdated() {
        setOrder(100);
    }

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<Switch> event) {
        Switch switchDevice = event.getSource();
        //如果原先的设备已经是switch，而不是由device转换过来的，则不是topo发现过程中更新设备类型
        // 则不需要进行子网节点的创建
        if( Switch.class.isAssignableFrom(event.getLegacy().getClass()))
             return;
        String scopePath = switchDevice.getProperty(Switch.PROPERTY_SCOPE_PATH);
        String parentPath = Category.parentOf(scopePath);
        ManagedNode parentNode = nodeService.findByPath(parentPath);
        RouteEntry[] routeEntries = switchDevice.getRouteEntries();
        for (RouteEntry routeEntry : routeEntries) {
            if( routeEntry.getDest().equals("0.0.0.0") ) continue;
            if( routeEntry.getDest().startsWith("127.")) continue;
            //对于单个设备的路由，不创建子网
            if( routeEntry.getMask().equals("255.255.255.255")) continue;
            if (routeEntry.getType() != 3) continue;//direct
            String subnet = routeEntry.toSubnet();
            SubnetRange range = new SubnetRange(subnet);
            String relativePath = Device.convertAsPath(routeEntry.getDest());
            RangeNode node = nodeService.findRangeNodeBySubnet(subnet);
            if( node == null ){
                //这些node基于当前交换机的routes表构建
                node = new RangeNode();
                node.setProperty(Device.PROPERTY_RELATIVE_PATH, relativePath);
                node.setProperty(Device.PROPERTY_SOURCE, "discovery");
                node.setProperty(Device.PROPERTY_UP_LINK, switchDevice.getId().toString());
                node.setRange(range);
                node.setLabel(subnet);
                node.setComment("Auto created subnet under " + switchDevice );
                node.setIcon("monitor_range");
                //新创建的子网，暂时先不进行监控
                node.setState(State.Stopped);
                try {
                    nodeService.create(parentNode, node);
                } catch (NodeException e) {
                    logger.warn("Can't create range node of {} under {}, because of {}",
                                switchDevice, parentNode.getPath(), ExceptionUtils.getRootCauseMessage(e));
                }
            } else{
                // 已经有其他交换机创建了到这些子网，当前交换机应该建立与其之间的Topo Link 连接
                try {
                    RangeNode newNode = (RangeNode) node.clone();
                    newNode.setProperty(Resource.PROPERTY_UP_LINK, switchDevice.getId().toString());
                    //此地更新之后， 会有 CreateTopoLinkBetweenOtherSwitchAndRange 创建
                    // 这个交换机与range node直接的topo link
                    nodeService.update(node, newNode);
                } catch (Exception e) {
                    logger.warn("Can't update range node of {} under {}, because of {}",
                                switchDevice, parentNode.getPath(), ExceptionUtils.getRootCauseMessage(e));
                }
            }
        }
    }
}
