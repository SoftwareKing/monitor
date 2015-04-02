/**
 * Developer: Kadvin Date: 15/1/11 下午5:12
 */
package dnt.monitor.server;

import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.EngineSessionService;
import dnt.monitor.server.service.MonitorServerService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Monitor Module Service Config
 */
@Configuration
public class MonitorSystemUserConfig extends AbstractUserConfig {
    @Bean
    EngineServiceLocator engineServiceLocator(){
        return imports(EngineServiceLocator.class);
    }

    @Bean
    EngineSessionService engineSessionService(){
        return imports(EngineSessionService.class);
    }

    @Bean
    MonitorServerService monitorServerService(){
        return imports(MonitorServerService.class);
    }
}
