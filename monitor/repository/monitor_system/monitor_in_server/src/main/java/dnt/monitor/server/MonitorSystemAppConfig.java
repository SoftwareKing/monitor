/**
 * Developer: Kadvin Date: 15/1/11 下午5:12
 */
package dnt.monitor.server;

import dnt.monitor.server.service.EngineService;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.EngineSessionService;
import dnt.monitor.server.service.MonitorServerService;
import net.happyonroad.UtilUserConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.web.socket.WebSocketHandler;

/**
 * Monitor Module Service Config
 */
@Configuration
@Import({ServerDefinitionUserConfig.class, UtilUserConfig.class})
public class MonitorSystemAppConfig extends DefaultServerAppConfig {

    @Override
    public void doExports() {
        // 虽然，engine service 接口会通过 service locator机制被发现
        // 但为了使用方便，还是单独export下
        exports(EngineService.class);
        exports(EngineServiceLocator.class);
        exports(EngineSessionService.class);
        exports(MonitorServerService.class);
        // To be used by Monitor Mvc Config
        exports(WebSocketHandler.class, "south");
        // To be used by Monitor Security Config
        exports(AuthenticationProvider.class, "south");
    }
}
