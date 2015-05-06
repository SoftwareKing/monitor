package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.wbem.WbemVisitorFactory;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>WBEM ability in Engine side App Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.engine.wbem"})
@Import(DefinitionUserConfig.class)
public class EngineWbemAppConfig extends EngineDefinitionAppConfig {


    @Override
    public void doExports() {
        exports(WbemVisitorFactory.class);
        exports(GenericSampleService.class, "wbem");
    }
}
