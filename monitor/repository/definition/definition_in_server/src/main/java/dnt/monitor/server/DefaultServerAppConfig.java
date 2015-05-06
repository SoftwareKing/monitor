package dnt.monitor.server;

import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Class Title</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@Import(ServerDefinitionUserConfig.class)
@ComponentScan({"dnt.monitor.server.handler", "dnt.monitor.server.support"})
public class DefaultServerAppConfig extends AbstractAppConfig{
}
