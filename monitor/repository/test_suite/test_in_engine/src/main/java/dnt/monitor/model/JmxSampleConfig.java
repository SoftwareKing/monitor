package dnt.monitor.model;

import net.happyonroad.component.container.ComponentLoader;
import net.happyonroad.component.core.ComponentContext;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>Meta Support</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.support",
                "dnt.monitor.engine.jmx",
                "dnt.monitor.engine.support"
})
public class JmxSampleConfig {
    @Bean
    ComponentLoader componentLoader() {
        return EasyMock.createMock(ComponentLoader.class);
    }

    @Bean
    ComponentContext componentContext() {
        return EasyMock.createMock(ComponentContext.class);
    }

}
