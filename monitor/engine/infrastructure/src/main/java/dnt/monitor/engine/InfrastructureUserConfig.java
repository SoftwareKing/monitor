/**
 * Developer: Kadvin Date: 15/1/16 下午1:58
 */
package dnt.monitor.engine;

import dnt.monitor.engine.service.*;
import net.happyonroad.CacheUserConfig;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>使用Infrastructure模块的应用程序默认配置</h1>
 */
@Configuration
@Import(CacheUserConfig.class)
public class InfrastructureUserConfig extends AbstractUserConfig{

    @Bean
    EngineServiceRegistry engineServiceRegistry() {
        return imports(EngineServiceRegistry.class);
    }

    @Bean
    GlobalClassLoader globalClassLoader(){
        return imports(GlobalClassLoader.class);
    }

    @Bean
    NodeStore nodeStore(){
        return imports(NodeStore.class);
    }

    @Bean
    PolicyStore policyStore(){
        return imports(PolicyStore.class);
    }

    @Bean
    ResourceStore resourceStore(){
        return imports(ResourceStore.class);
    }

    @Bean
    SampleHelperFactory sampleFactory(){
        return imports(SampleHelperFactory.class);
    }
}
