package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>SSH in Engine Side Application Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.engine.ssh"})
@Import(DefinitionUserConfig.class)
public class EngineSshAppConfig extends EngineDefinitionAppConfig {


    @Override
    public void doExports() {
        exports(SshVisitorFactory.class);
    }
}
