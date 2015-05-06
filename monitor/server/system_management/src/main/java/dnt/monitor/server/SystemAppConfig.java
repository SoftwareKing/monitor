/**
 * Developer: Kadvin Date: 14/12/28 上午11:37
 */
package dnt.monitor.server;

import dnt.monitor.server.service.UserSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.WebSocketHandler;

/**
 * <h1>System Management模块的应用配置</h1>
 */
@Configuration
@Import({ServerDefinitionUserConfig.class, MonitorSystemUserConfig.class})
public class SystemAppConfig  extends DefaultServerAppConfig{
    @Autowired
    @Qualifier("operatorManager")
    UserDetailsService userDetailsService;

    @Override
    public void doExports() {
        // to be used by other module
        exports(UserSessionService.class);
        // To Be used by Monitor Mvc Config
        exports(WebSocketHandler.class, "north");
        // To be used by Monitor Security Config
        exports(UserDetailsService.class, userDetailsService, "operator");

    }
}
