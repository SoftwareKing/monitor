package dnt.monitor.engine;

import dnt.monitor.engine.ssh.SshVisitorFactory;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>Ssh Repository in Engine side User Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class EngineSshUserConfig extends AbstractUserConfig {
    @Bean
    public SshVisitorFactory sshVisitorFactory(){
        return imports(SshVisitorFactory.class);
    }

}
