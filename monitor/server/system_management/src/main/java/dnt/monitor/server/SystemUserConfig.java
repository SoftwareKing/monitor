/**
 * Developer: Kadvin Date: 14/12/28 上午11:37
 */
package dnt.monitor.server;

import dnt.monitor.server.service.UserSessionService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>System Management模块的应用配置</h1>
 */
@Configuration
@Import({ServerDefinitionUserConfig.class, MonitorSystemUserConfig.class})
public class SystemUserConfig extends AbstractUserConfig{
    @Bean
    UserSessionService userSessionService(){
        return imports(UserSessionService.class);
    }
}
