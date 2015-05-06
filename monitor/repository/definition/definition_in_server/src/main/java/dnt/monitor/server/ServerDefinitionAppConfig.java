/**
 * Developer: Kadvin Date: 15/2/2 下午6:47
 */
package dnt.monitor.server;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.PlatformUserConfig;
import net.happyonroad.UtilUserConfig;
import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>服务定义模块的应用配置</h1>
 */
@Configuration
@Import({UtilUserConfig.class,
         PlatformUserConfig.class,
         DefinitionUserConfig.class
})
@ComponentScan({"dnt.monitor.server.handler", "dnt.monitor.server.support"})
public class ServerDefinitionAppConfig extends AbstractAppConfig{

    @Override
    public void doExports() {
        exports(LinkService.class);
        exports(ServiceLocator.class);
    }
}
