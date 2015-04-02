package dnt.monitor.server.handler.resource;

import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.model.Category;
import net.happyonroad.model.IpRange;
import net.happyonroad.model.SubnetRange;
import net.happyonroad.spring.Bean;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>检测到交换机设备后，将其提升到与其子网一个level</h1>
 *
 * @author Jay Xiong
 */
@Component
public class MoveSwitchNodeUpAfterSwitchUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<Switch>> {

    //在创建Switch下的子网节点之前，先把Switch提升
    public MoveSwitchNodeUpAfterSwitchUpdated() {
        setOrder(50);
    }

    @Autowired
    NodeService nodeService;

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<Switch> event) {
        //如果原先的设备已经是switch，而不是由device转换过来的，则不是topo发现过程中更新设备类型
        // 则不需要进行子网节点的创建
        if( Switch.class.isAssignableFrom(event.getLegacy().getClass()))
             return;
        //TODO switch和这个当前子网的的topo link没创建
        Switch device = event.getSource();
        ResourceNode node = nodeService.findByResourceId(device.getId());
        if( node == null ) return;
        String path = node.getPath();
        String name = FilenameUtils.getBaseName(path);
        String parentPath = Category.parentOf(path);
        ManagedNode parentNode = nodeService.findByPath(parentPath);
        if (!(parentNode instanceof RangeNode)) return;
        IpRange range = ((RangeNode) parentNode).getRange();
        if (!(range instanceof SubnetRange)) return;
        SubnetRange subnet = (SubnetRange) range;
        if (!isSubnetOf(device, subnet)) return;

        String newPath = Category.parentOf(parentPath) + "/" + name;
        try {
            nodeService.updateNodesPath(path, newPath);
        } catch (NodeException e) {
            logger.error("Can't move up switch from {} to {}, because of {}",
                         path, newPath, ExceptionUtils.getRootCauseMessage(e));
        }
    }

    boolean isSubnetOf(Switch device, SubnetRange subnet) {
        if (device.getRouteEntries() == null)
            return false;
        for (RouteEntry entry : device.getRouteEntries()) {
            if(entry.getDest().equals("0.0.0.0")) continue;
            if (StringUtils.equalsIgnoreCase(subnet.toString(), entry.toSubnet()))
                return true;
        }
        return false;
    }
}
