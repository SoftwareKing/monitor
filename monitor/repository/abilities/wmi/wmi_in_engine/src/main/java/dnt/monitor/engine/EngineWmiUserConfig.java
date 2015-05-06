package dnt.monitor.engine;

import dnt.monitor.engine.wmi.WmiVisitorFactory;
import dnt.monitor.engine.service.GenericSampleService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>WMI in Engine side User Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class EngineWmiUserConfig extends AbstractUserConfig {
    @Bean
    public WmiVisitorFactory wmiVisitorFactory(){
        return imports(WmiVisitorFactory.class);
    }


    @Bean
    public GenericSampleService wmiSampleService(){
        return imports(GenericSampleService.class, "wmi");
    }

}
