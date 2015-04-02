/**
 * Developer: Kadvin Date: 15/1/16 下午1:58
 */
package dnt.monitor.engine;

import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.service.EngineServiceRegistry;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.service.SampleService;
import net.happyonroad.CacheUserConfig;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>使用Infrastructure模块的应用程序默认配置</h1>
 */
@Configuration
@Import(CacheUserConfig.class)
public class InfrastructureUserConfig extends AbstractUserConfig{

    @Bean
    public EngineServiceRegistry engineServiceRegistry() {
        return imports(EngineServiceRegistry.class);
    }

    @Bean
    public SnmpVisitorFactory snmpVisitorFactory(){
        return imports(SnmpVisitorFactory.class);
    }

    @Bean
    public SshVisitorFactory sshVisitorFactory(){
        return imports(SshVisitorFactory.class);
    }

    @Bean
    public DeviceRecognizer snmpDeviceRecognizer(){
        return imports(DeviceRecognizer.class, "snmp");
    }

    @Bean
    public SampleService snmpSampleService(){
        return imports(SampleService.class, "snmp");
    }

    @Bean
    public SampleService sshSampleService(){
        return imports(SampleService.class, "ssh");
    }

    @Bean
    public SampleService mockSampleService(){
        return imports(SampleService.class, "mock");
    }

}
