/**
 * Developer: Kadvin Date: 15/1/14 上午9:18
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.model.Device;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.RangeNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.model.SubnetRange;
import net.happyonroad.type.State;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <h1>监听引擎创建事件， 为其创建管理节点</h1>
 * 对于主动注册的引擎，应该为其创建（如果非主动注册，也就是存在相应的管理节点，则无需自动创建）
 * <ol>
 * <li>相应的资源管理节点
 * <li>群组管理节点
 * </ol>
 * 这些管理节点被创建之后，将会由NodeEventProcess创建相应的TopoNode/Map
 */
@Component
class CreateDefaultSubnetAfterEngineApproved extends EngineApprovalListener {
    @Autowired
    private NodeService nodeService;

    public CreateDefaultSubnetAfterEngineApproved() {
        setOrder(30);
    }

    @Override
    protected void onApprove(MonitorEngine engine, MonitorEngine... oldEngines) {
        autoCreateNodesForEngine(engine);
    }

    /**
     * 对于通过界面手工创建的监控引擎，其engine scope，engine node均已经创建
     * 本方法可以兼容这种情况，不会重复创建
     * @param engine 需要创建管理节点的引擎对象
     */
    void autoCreateNodesForEngine(MonitorEngine engine) {
        if("0.0.0.0".equals(engine.getHostAddress())){
            logger.info("The engine host address is unknown, not create any subnet for it now");
            return;
        }
        GroupNode scopeNode = (GroupNode) nodeService.findByPath(engine.getScopePath());
        //尝试为监控引擎创建第一个所负责的子网
        // 如果该子网已经被其他监控引擎监控，则创建失败，输出警告即可；
        // 如果该子网被其他range涵盖，则进行创建，但对其他range的影响是：其他range里面已有的资源不会被移动过来；
        // 本range里面新发现的资源，如果已经被其他range管理，也不回添加进来
        // TODO 这些逻辑需要深入讨论
        createDefaultSubnetNode(engine, scopeNode);
    }

    RangeNode createDefaultSubnetNode(MonitorEngine engine, GroupNode scopeNode) {
        String address = engine.getHostAddress(); // ip:port
        String netAddress = convertAsNetAddress(address);
        String rangeAddress = netAddress + "/24";
        SubnetRange range = new SubnetRange(rangeAddress);
        String relativePath = Device.convertAsPath(netAddress);
        String path = engine.getScopePath() + "/" + relativePath;
        try {
            nodeService.findByPath(path);
            return null;
        } catch (IllegalArgumentException e) {
            // skip it
        }
        RangeNode exist = nodeService.findRangeNodeBySubnet(rangeAddress);
        if( exist != null ) {
            logger.warn("The subnet {} is created as {} already", rangeAddress, exist);
            return null;
        }
        RangeNode node = new RangeNode();
        node.setProperty(Device.PROPERTY_RELATIVE_PATH, relativePath);
        node.setRange(range);
        node.setLabel(range.toString());
        node.setComment("Auto created subnet for " + engine);
        node.setIcon("monitor_range");
        node.setState(State.Running);
        try {
            return (RangeNode) nodeService.create(scopeNode, node);
        } catch (NodeException e) {
            logger.warn("Can't create range node for engine {} under scope path {}, because of {}",
                        engine, scopeNode.getPath(), MiscUtils.describeException(e));
            return null;
        }
    }

    private String convertAsNetAddress(String address) {
        String[] numbers = address.split("\\.");
        numbers[3] = "0";
        return StringUtils.join(numbers, ".");
    }
}
