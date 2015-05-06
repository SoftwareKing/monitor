/**
 * Developer: Kadvin Date: 15/1/29 下午6:44
 */
package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.*;
import dnt.monitor.service.ConfigurationService;
import dnt.monitor.service.ControlService;
import net.happyonroad.CacheUserConfig;
import net.happyonroad.extension.ExtensionManager;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.service.ExtensionContainer;
import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Engine Infrastructure Application Configuration</h1>
 */
@Configuration
@Import({DefinitionUserConfig.class, CacheUserConfig.class, EngineJmxUserConfig.class})
@ComponentScan({"dnt.monitor.engine.support",
                "dnt.monitor.engine.handler"
})
public class InfrastructureAppConfig extends AbstractAppConfig{
    @Autowired
    EngineServiceRegistry registry;

    @Bean
    public GlobalClassLoader globalClassLoader(ExtensionContainer container) {
        // 用 Thread上下文的Class Loader(main class loader)
        //  比 application 的 Class loader(platform class loader)
        // 更为全面，其可以看到除动态加载的类; Container Aware特性再看到其他
        return new GlobalClassLoader(Thread.currentThread().getContextClassLoader(), container);
    }

    // 用于加载扩展服务模块
    @Bean
    public ExtensionManager pkgManager() {
        return new ExtensionManager();
    }

    @Override
    protected void beforeExports() {
        super.beforeExports();
        registry.register(ControlService.class, getBean(ControlService.class));
        registry.register(ConfigurationService.class, getBean(ConfigurationService.class));
    }

    @Override
    public void doExports() {
        exports(EngineServiceRegistry.class);
        exports(GlobalClassLoader.class);

        exports(NodeStore.class);
        exports(PolicyStore.class);
        exports(ResourceStore.class);
        exports(SampleHelperFactory.class);
    }
}
