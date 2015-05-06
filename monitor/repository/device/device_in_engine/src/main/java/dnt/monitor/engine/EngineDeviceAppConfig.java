package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.service.IpServiceDiscover;
//import dnt.monitor.engine.service.SampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Engine Device Application Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan("dnt.monitor.engine.discover")
@Import({DefinitionUserConfig.class,
         EngineSnmpUserConfig.class,
         EngineShellUserConfig.class,
         EngineSshUserConfig.class
        })
public class EngineDeviceAppConfig extends EngineDefinitionAppConfig {
    @Autowired
    @Qualifier("snmpServiceDiscover")
    IpServiceDiscover snmpDiscover;
    @Autowired
    @Qualifier("sshServiceDiscover")
    IpServiceDiscover  sshDiscover;
    @Autowired
    @Qualifier("wmiServiceDiscover")
    IpServiceDiscover  wmiDiscover;
    @Autowired
    @Qualifier("localhostDiscover")
    IpServiceDiscover  localhostDiscover;
    //@Autowired
    //@Qualifier("deviceSampleManager")
    //SampleService sampleService;

    @Override
    protected void doExports() {
        super.doExports();
        exports(DeviceRecognizer.class);
        //exports(SampleService.class, sampleService, "device");
        exports(IpServiceDiscover.class, snmpDiscover, "snmp");
        exports(IpServiceDiscover.class, sshDiscover, "ssh");
        exports(IpServiceDiscover.class, wmiDiscover, "wmi");
        exports(IpServiceDiscover.class, localhostDiscover, "local");
    }
}
