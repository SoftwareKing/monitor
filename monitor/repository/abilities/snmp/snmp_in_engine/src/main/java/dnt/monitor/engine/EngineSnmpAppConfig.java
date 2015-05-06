package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Class Title</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.engine.snmp"})
@Import(DefinitionUserConfig.class)
public class EngineSnmpAppConfig extends EngineDefinitionAppConfig {

    @Override
    public void doExports() {
        exports(SnmpVisitorFactory.class);
        exports(GenericSampleService.class, "snmp");
    }
}
