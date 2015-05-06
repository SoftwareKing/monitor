package dnt.monitor.server;

import dnt.monitor.server.service.ServerDiscoveryService;
import net.happyonroad.UtilUserConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>资源管理模块的应用配置</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@Import({ServerDefinitionUserConfig.class, UtilUserConfig.class, MonitorSystemUserConfig.class})
public class ResourceAppConfig extends DefaultServerAppConfig{
    @Override
    protected void doExports() {
        super.doExports();
        exports(ServerDiscoveryService.class);
    }
}
