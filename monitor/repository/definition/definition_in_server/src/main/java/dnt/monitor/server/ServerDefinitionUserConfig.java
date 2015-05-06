/**
 * Developer: Kadvin Date: 15/1/6 下午10:47
 */
package dnt.monitor.server;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.CacheUserConfig;
import net.happyonroad.MessagingUserConfig;
import net.happyonroad.PlatformUserConfig;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>使用/依赖 Service Definition模块的 应用配置 </h1>
 */
@Configuration
@Import({
        PlatformUserConfig.class,
        CacheUserConfig.class,
        MessagingUserConfig.class,
        DefinitionUserConfig.class
})
public class ServerDefinitionUserConfig extends AbstractUserConfig {
    @Bean
    public ServiceLocator serviceLocator() {
        return imports(ServiceLocator.class);
    }

    @Bean
    public LinkService linkService(){
        return imports(LinkService.class);
    }
}
