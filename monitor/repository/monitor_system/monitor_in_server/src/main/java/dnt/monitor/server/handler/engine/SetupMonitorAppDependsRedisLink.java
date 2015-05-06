package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.*;
import dnt.monitor.server.service.EngineService;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.MonitorServerService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>Setup Monitor App(Engine, Server) depends Redis relationship</h1>
 * <p/>
 * 在 Redis 创建之后执行
 *
 * @author Jay Xiong
 */
@Component
class SetupMonitorAppDependsRedisLink extends Bean
        implements ApplicationListener<ObjectCreatedEvent<Redis>> {

    @Autowired
    ServiceLocator serviceLocator;

    @Autowired
    MonitorServerService serverService;
    @Autowired
    EngineService        engineService;


    public SetupMonitorAppDependsRedisLink() {
        setOrder(2100);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<Redis> event) {
        Redis redis = event.getSource();
        MonitorServer server = serverService.getServer();
        setupLink(redis, server);
        List<MonitorEngine> engines = engineService.findAllByStatus(ApproveStatus.Approved);
        for (MonitorEngine engine : engines) {
            setupLink(redis, engine);
        }
    }

    protected void setupLink(Redis redis, MonitorApplication app) {
        if (!StringUtils.equals(redis.getHostAddress(), app.getHostAddress())) return ;
        String port = app.getProperty("redis.port", "6379");
        String globalPort = app.getProperty("redis.global.port", "6379");
        String localPort = app.getProperty("redis.local.port", "6379");
        if (port.equals(redis.getPort()) || globalPort.equals(redis.getPort()) || localPort.equals(redis.getPort())) {
            try {
                LinkService linkService = serviceLocator.locateLinkService(LinkType.Depends.name());
                linkService.link(app, redis, LinkType.Depends);
            } catch (ResourceException e) {
                logger.error("Can't create link for: app -use-> redis", e);
            }
        }
    }
}
