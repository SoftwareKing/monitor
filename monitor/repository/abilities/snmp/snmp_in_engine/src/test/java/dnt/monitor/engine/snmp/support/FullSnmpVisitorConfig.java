package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.spring.service.ServiceRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.easymock.EasyMock;

/**
 * <h1>The Snmp visitor test configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class FullSnmpVisitorConfig {
    @Bean
    DefaultMibRepository mibRepository(){
        return new DefaultMibRepository();
    }

    @Bean
    ServiceRegistry serviceRegistry(){
        return EasyMock.createMock(ServiceRegistry.class);
    }

    @Bean
    MibScanner mibScanner(){
        return new MibScanner();
    }

    @Bean
    ClassLoader globalClassLoader(){
        return getClass().getClassLoader();
    }

    @Bean
    SnmpVisitorFactory visitorFactory(){
        return new DefaultSnmpVisitorFactory();
    }

    @Bean
    ComponentContext componentContext() {
        return EasyMock.createMock(ComponentContext.class);
    }
}
