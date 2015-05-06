/**
 * Developer: Kadvin Date: 15/2/16 下午2:27
 */
package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.EngineServiceRegistry;
import dnt.monitor.service.RealtimeService;
import dnt.monitor.service.SynchronizeService;
import net.happyonroad.util.NamedThreadFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

/**
 * <h1>主动监控模块的应用配置</h1>
 */
@Configuration
@Import({DefinitionUserConfig.class, InfrastructureUserConfig.class})
public class MonitoringAppConfig extends DefaultEngineAppConfig {
    @Autowired
    EngineServiceRegistry registry;

    @Bean
    ThreadPoolTaskScheduler monitoringTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setThreadFactory(new NamedThreadFactory("Monitoring"));
        return scheduler;
    }

    @Override
    protected void beforeExports() {
        super.beforeExports();
        registry.register(SynchronizeService.class, getBean(SynchronizeService.class));
        registry.register(RealtimeService.class, getBean(RealtimeService.class));
    }
}
