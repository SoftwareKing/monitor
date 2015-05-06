package dnt.monitor.engine;

import dnt.monitor.engine.jmx.JmxVisitorFactory;
import dnt.monitor.engine.service.GenericSampleService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>JMX ability in Engine side User Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class EngineJmxUserConfig extends AbstractUserConfig {
    @Bean
    public JmxVisitorFactory jmxVisitorFactory(){
        return imports(JmxVisitorFactory.class);
    }


    @Bean
    public GenericSampleService jmxSampleService(){
        return imports(GenericSampleService.class, "jmx");
    }

}
