package dnt.monitor.engine;

import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.shell.ShellVisitorFactory;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>Shell in Engine side User Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class EngineShellUserConfig extends AbstractUserConfig {
    @Bean
    public ShellVisitorFactory shellVisitorFactory(){
        return imports(ShellVisitorFactory.class);
    }


    @Bean
    public GenericSampleService shellSampleService(){
        return imports(GenericSampleService.class, "shell");
    }

}
