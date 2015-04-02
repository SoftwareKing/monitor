package dnt.monitor.server;

import dnt.monitor.server.service.ServerDiscoveryService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>导入资源管理模块的配置</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class ResourceUserConfig extends AbstractUserConfig{
    @Bean
    ServerDiscoveryService serverDiscoveryService(){
        return imports(ServerDiscoveryService.class);
    }
}
