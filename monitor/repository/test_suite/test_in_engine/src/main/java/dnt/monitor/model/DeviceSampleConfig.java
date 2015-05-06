package dnt.monitor.model;

import net.happyonroad.component.container.ComponentLoader;
import net.happyonroad.component.core.*;
import net.happyonroad.component.core.Component;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.service.ExtensionContainer;
import net.happyonroad.spring.service.ServiceRegistry;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;

/**
 * <h1>Meta Support</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.support",
                "dnt.monitor.engine.shell",
                "dnt.monitor.engine.ssh",
                "dnt.monitor.engine.snmp"
})
public class DeviceSampleConfig implements ExtensionContainer{
    @Bean
    ComponentLoader componentLoader() {
        return EasyMock.createMock(ComponentLoader.class);
    }

    @Bean
    ComponentContext componentContext() {
        return EasyMock.createMock(ComponentContext.class);
    }

    @Bean
    ServiceRegistry serviceRegistry(){
        return EasyMock.createMock(ServiceRegistry.class);
    }

    @Bean
    GlobalClassLoader globalClassLoader(){
        return new GlobalClassLoader(Thread.currentThread().getContextClassLoader(), this);
    }

    @Override
    public List<Component> getExtensions() {
        return Collections.emptyList();
    }
}
