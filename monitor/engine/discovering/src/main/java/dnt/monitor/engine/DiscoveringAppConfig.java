package dnt.monitor.engine;

import dnt.monitor.engine.service.EngineServiceRegistry;
import dnt.monitor.service.DiscoveryService;
import net.happyonroad.concurrent.StrategyExecutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.util.concurrent.ExecutorService;

/**
 * <h1>设备，资源发现模块的应用配置</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@Import(InfrastructureUserConfig.class)
public class DiscoveringAppConfig extends DefaultEngineAppConfig{
    @Autowired
    EngineServiceRegistry registry;
    @Override
    protected void beforeExports() {
        super.beforeExports();
        registry.register(DiscoveryService.class, getBean(DiscoveryService.class));
    }

    @Bean
    ExecutorService discoveryExecutor(){
        return new StrategyExecutorService("discovery");
    }
}
