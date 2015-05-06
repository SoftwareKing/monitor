package dnt.monitor.engine.support;

import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.service.ResourceStore;
import dnt.monitor.engine.service.SampleHelperFactory;
import net.happyonroad.component.container.ComponentLoader;
import net.happyonroad.component.core.Component;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.service.ExtensionContainer;
import net.happyonroad.spring.service.ServiceRegistry;
import org.easymock.EasyMock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * <h1>Test Configuration of Discover Manager</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({
        "dnt.monitor.support",
        "dnt.monitor.engine.discover",
        "dnt.monitor.engine.snmp.support",
        "dnt.monitor.engine.shell.support",
        "dnt.monitor.engine.ssh.support",
        "dnt.monitor.engine.jmx.support",
        "net.happyonroad.cache.support"})
public class DiscoverManagerConfig implements ExtensionContainer {

    @Autowired
    @Qualifier("shellSampleManager")
    GenericSampleService shellSampleManager;

    @Bean
    DiscoverManager discoverManager() {
        return new DiscoverManager();
    }

    @Bean
    ExecutorService discoveryExecutor() {
        return Executors.newCachedThreadPool();
    }

    @Bean
    DefaultNodeStore nodeStore() {
        return new DefaultNodeStore();
    }

    @Bean
    ResourceStore resourceStore() {
        return new DefaultResourceStore();
    }

    @Bean
    SampleHelperFactory sampleHelperFactory() {
        return new DefaultSampleHelperFactory();
    }

    @Bean
    DeviceRecognizer deviceRecognizer() {
        return new DefaultDeviceRecognizer();
    }

    @Bean
    ComponentLoader componentLoader() {
        return EasyMock.createMock(ComponentLoader.class);
    }

    @Bean
    ComponentContext componentContext() {
        return EasyMock.createMock(ComponentContext.class);
    }

    @Bean
    ServiceRegistry serviceRegistry() {
        return EasyMock.createMock(ServiceRegistry.class);
    }

    @Bean
    GenericSampleService shellSampleService() {
        return shellSampleManager;
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
