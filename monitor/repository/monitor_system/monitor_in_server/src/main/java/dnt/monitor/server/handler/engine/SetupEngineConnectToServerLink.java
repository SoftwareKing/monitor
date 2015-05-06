package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.LinkType;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.MonitorServer;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.MonitorServerService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>Setup Engine connect to Server relationship</h1>
 *
 * After Server Node 创建之后执行
 *
 * @author Jay Xiong
 */
@Component
class SetupEngineConnectToServerLink extends Bean
        implements ApplicationListener<ObjectCreatedEvent<MonitorEngine>> {

    @Autowired
    ServiceLocator       serviceLocator;

    @Autowired
    MonitorServerService serverService;

    public SetupEngineConnectToServerLink() {
        //After setup server node(50)
        setOrder(60);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<MonitorEngine> event) {
        MonitorEngine engine = event.getSource();
        MonitorServer server = serverService.getServer();
        try {
            LinkService linkService = serviceLocator.locateLinkService(LinkType.Connect.name());
            linkService.link(engine, server, LinkType.Connect);
        } catch (ResourceException e) {
            logger.error("Can't create link for: engine-connect-server", e);
        }
    }
}
