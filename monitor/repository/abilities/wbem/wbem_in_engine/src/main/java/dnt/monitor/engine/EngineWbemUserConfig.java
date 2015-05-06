package dnt.monitor.engine;

import dnt.monitor.engine.wbem.WbemVisitorFactory;
import dnt.monitor.engine.service.GenericSampleService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>WBEM ability in Engine side User Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class EngineWbemUserConfig extends AbstractUserConfig {
    @Bean
    public WbemVisitorFactory jmxVisitorFactory(){
        return imports(WbemVisitorFactory.class);
    }


    @Bean
    public GenericSampleService wbemSampleService(){
        return imports(GenericSampleService.class, "webem");
    }

}
