package dnt.monitor.engine.ssh.support;

import net.happyonroad.component.container.ComponentLoader;
import net.happyonroad.component.core.ComponentContext;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
@Configuration
@ComponentScan("dnt.monitor.support")
public class MetaManagerConfig {
    @Bean
    ComponentLoader componentLoader() {
        return EasyMock.createMock(ComponentLoader.class);
    }

    @Bean
    ComponentContext componentContext() {
        return EasyMock.createMock(ComponentContext.class);
    }
}
