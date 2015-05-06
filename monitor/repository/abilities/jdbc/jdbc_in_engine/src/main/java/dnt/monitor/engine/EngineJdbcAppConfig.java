package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.jdbc.JdbcVisitorFactory;
import dnt.monitor.engine.service.GenericSampleService;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Database Repository in Engine side App Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.engine.jdbc"})
@Import(DefinitionUserConfig.class)
public class EngineJdbcAppConfig extends EngineDefinitionAppConfig {

    @Override
    public void doExports() {
        exports(JdbcVisitorFactory.class);
        exports(GenericSampleService.class, "jdbc");
    }
}
