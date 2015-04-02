/**
 * Developer: Kadvin Date: 15/2/16 下午2:18
 */
package dnt.monitor.engine;

import dnt.monitor.engine.service.EngineServiceRegistry;
import dnt.monitor.service.ConfigurationService;
import dnt.monitor.service.DiscoveryService;
import net.happyonroad.concurrent.StrategyExecutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.util.concurrent.ExecutorService;

/**
 * <h1>资源管理模块的应用配置</h1>
 */
@Configuration
@Import({InfrastructureUserConfig.class})
public class ResourcingAppConfig extends DefaultEngineAppConfig {
    @Autowired
    EngineServiceRegistry registry;

    @Override
    protected void beforeExports() {
        super.beforeExports();
        registry.register(ConfigurationService.class, getBean(ConfigurationService.class));
        registry.register(DiscoveryService.class, getBean(DiscoveryService.class));
    }

    @Bean
    ExecutorService discoveryExecutor(){
        return new StrategyExecutorService("discovery");
    }
}
