/**
 * Developer: Kadvin Date: 15/1/29 下午6:44
 */
package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.service.EngineServiceRegistry;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.service.ControlService;
import dnt.monitor.service.SampleService;
import net.happyonroad.extension.ExtensionManager;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.service.ExtensionContainer;
import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Engine Infrastructure Application Configuration</h1>
 */
@Configuration
@Import({DefinitionUserConfig.class})
@ComponentScan({"dnt.monitor.engine.support",
                "dnt.monitor.engine.handler",
                "dnt.monitor.engine.snmp.support",
                "dnt.monitor.engine.ssh.support"
})
public class InfrastructureAppConfig extends AbstractAppConfig{
    @Autowired
    EngineServiceRegistry registry;
    @Autowired
    @Qualifier("snmpSampleManager")
    SampleService snmpSampleService;
    @Autowired
    @Qualifier("sshSampleManager")
    SampleService sshSampleService;
    @Autowired
    @Qualifier("deviceSampleManager")
    SampleService deviceSampleService;

    @Bean
    public GlobalClassLoader globalClassLoader(ExtensionContainer container) {
        // 用 Thread上下文的Class Loader(main class loader)
        //  比 application 的 Class loader(platform class loader)
        // 更为有效，其可以看到除动态加载的类; Container Aware特性再看到其他
        return new GlobalClassLoader(Thread.currentThread().getContextClassLoader(), container);
    }

    // 用于加载扩展服务模块
    @Bean
    public ExtensionManager pkgManager() {
        return new ExtensionManager();
    }

    @Override
    protected void beforeExports() {
        super.beforeExports();
        registry.register(ControlService.class, getBean(ControlService.class));
        //registry.register(SampleService.class, getBean(SampleService.class));
    }

    @Override
    public void doExports() {
        exports(EngineServiceRegistry.class);
        exports(SnmpVisitorFactory.class);
        exports(SshVisitorFactory.class);
        exports(DeviceRecognizer.class, "snmp");
        exports(SampleService.class, snmpSampleService, "snmp");
        exports(SampleService.class, sshSampleService, "ssh");
        exports(SampleService.class, deviceSampleService, "mock");
    }
}
