package dnt.monitor.server.handler.node;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.MonitorServerService;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>Setup MonitorApp RunOn Host Link</h1>
 *
 * 由于监控引擎，监控服务器早于其所在的主机被创建
 *
 * @author Jay Xiong
 */
@Component
class SetupMonitorAppRunOnHostLink extends Bean
        implements ApplicationListener<ObjectCreatedEvent<ResourceNode>> {
    @Autowired
    NodeService          nodeService;
    @Autowired
    MonitorServerService serverService;
    @Autowired
    LinkService<Link>    linkService;

    //晚于 topo node创建过程
    // CreateTopoNodeAfterNodeCreated(100), 200, 300
    public SetupMonitorAppRunOnHostLink() {
        setOrder(1000);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<ResourceNode> event) {
        ResourceNode node = event.getSource();
        Resource resource = node.getResource();
        if (!(resource instanceof Host)) return;
        Host host = (Host) resource;
        if (!node.isSystemNode()) return;
        MonitorEngine engine;
        try {
            engine = nodeService.findEngineByNode(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't find engine node for " + node);
        }
        if (StringUtils.equals(engine.getHostAddress(), host.getAddress())) {
            setupRunOnLink(engine, host);
        }
        MonitorServer server = serverService.getServer();
        if (StringUtils.equals(server.getHostAddress(), host.getAddress())){
            setupRunOnLink(server, host);
        }

    }

    private void setupRunOnLink(MonitorApplication application, Host host) {
        try {
            linkService.link(application, host, LinkType.RunOn);
        } catch (ResourceException e) {
            logger.error("Can't setup {} -RunOn-> {}", application, host);
        }

    }
}
