/**
 * Developer: Kadvin Date: 14/12/22 下午3:44
 */
package dnt.monitor.server;

import dnt.monitor.server.service.EventService;
import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>事件模块的应用配置类</h1>
 */
@Configuration
@Import(SystemUserConfig.class)
public class EventAppConfig extends AbstractAppConfig{

    @Override
    public void doExports() {
        exports(EventService.class);
    }
}
