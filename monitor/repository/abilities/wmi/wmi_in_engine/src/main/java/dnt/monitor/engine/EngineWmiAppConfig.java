package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.wmi.WmiVisitorFactory;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>WMI in Engine side App Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.engine.wmi"})
@Import(DefinitionUserConfig.class)
public class EngineWmiAppConfig extends EngineDefinitionAppConfig {

    @Override
    public void doExports() {
        exports(WmiVisitorFactory.class);
        exports(GenericSampleService.class, "wmi");
    }
}
