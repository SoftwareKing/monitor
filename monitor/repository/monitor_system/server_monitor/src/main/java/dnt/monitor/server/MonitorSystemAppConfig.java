/**
 * Developer: Kadvin Date: 15/1/11 下午5:12
 */
package dnt.monitor.server;

import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.EngineSessionService;
import dnt.monitor.server.service.MonitorServerService;
import net.happyonroad.UtilUserConfig;
import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.web.socket.WebSocketHandler;

/**
 * Monitor Module Service Config
 */
@Configuration
@Import({ServerDefinitionUserConfig.class, UtilUserConfig.class})
public class MonitorSystemAppConfig extends AbstractAppConfig {

    @Override
    public void doExports() {
        // engine service 接口会通过 service locator机制被发现， 所以就不用export
        exports(EngineServiceLocator.class);
        exports(EngineSessionService.class);
        exports(MonitorServerService.class);
        // To be used by Monitor Mvc Config
        exports(WebSocketHandler.class, "south");
        // To be used by Monitor Security Config
        exports(AuthenticationProvider.class, "south");
    }
}
