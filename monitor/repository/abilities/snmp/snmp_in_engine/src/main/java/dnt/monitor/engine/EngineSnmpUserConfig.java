package dnt.monitor.engine;

import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.engine.service.GenericSampleService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>Snmp Repository in Engine side User Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class EngineSnmpUserConfig extends AbstractUserConfig {
    @Bean
    public SnmpVisitorFactory snmpVisitorFactory(){
        return imports(SnmpVisitorFactory.class);
    }


    @Bean
    public GenericSampleService snmpSampleService(){
        return imports(GenericSampleService.class, "snmp");
    }
}
