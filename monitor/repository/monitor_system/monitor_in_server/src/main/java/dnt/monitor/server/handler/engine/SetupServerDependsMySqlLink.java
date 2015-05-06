package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.LinkType;
import dnt.monitor.model.MonitorServer;
import dnt.monitor.model.MySql;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.MonitorServerService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>Setup Server depends MySQL relationship</h1>
 *
 * 在MySQL 创建之后执行
 *
 * @author Jay Xiong
 */
@Component
class SetupServerDependsMySqlLink extends Bean
        implements ApplicationListener<ObjectCreatedEvent<MySql>> {

    @Autowired
    ServiceLocator       serviceLocator;

    @Autowired
    MonitorServerService serverService;

    public SetupServerDependsMySqlLink() {
        //After setup server node(50)
        setOrder(2000);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<MySql> event) {
        MySql mysql = event.getSource();
        MonitorServer server = serverService.getServer();
        if(!StringUtils.equals(mysql.getHostAddress(), server.getHostAddress() )) return;
        String port = server.getProperty("db.port", "3306");
        if(!port.equals(mysql.getPort())) return;
        try {
            LinkService linkService = serviceLocator.locateLinkService(LinkType.Depends.name());
            linkService.link(server, mysql, LinkType.Depends);
        } catch (ResourceException e) {
            logger.error("Can't create link for: server -depends-> mysql", e);
        }
    }
}
