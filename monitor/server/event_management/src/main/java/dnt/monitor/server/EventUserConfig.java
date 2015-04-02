/**
 * Developer: Kadvin Date: 14/12/22 下午3:44
 */
package dnt.monitor.server;

import dnt.monitor.server.service.EventService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>事件模块的使用者应用配置类</h1>
 */
@Configuration
public class EventUserConfig extends AbstractUserConfig{

    @Bean
    EventService eventService(){
        return imports(EventService.class);
    }
}
