package dnt.monitor.model;

import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.engine.shell.ShellVisitorFactory;
import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.MetaException;
import dnt.monitor.service.MetaService;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.spring.service.ServiceRegistry;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * <h1>Sample Device Test</h1>
 *
 * @author Jay Xiong
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = DeviceSampleConfig.class)
public abstract class DeviceSampleTest {
    @Autowired
    protected MetaService metaService;
    @Autowired
    SnmpVisitorFactory  snmpVisitorFactory;
    @Autowired
    SshVisitorFactory   linuxVisitorFactory;
    @Autowired    
    SshVisitorFactory    aixVisitorFactory;
    @Autowired
    ShellVisitorFactory  localVisitorFactory;
    @Autowired
    @Qualifier("shellSampleManager")
    protected GenericSampleService shellSampleService;
    @Autowired
    @Qualifier("snmpSampleManager")
    protected GenericSampleService snmpSampleService;

    @Autowired
    ServiceRegistry   serviceRegistry;
    @Autowired
    GlobalClassLoader globalClassLoader;

    @Autowired
    ComponentContext   componentContext;
    @Autowired
    ApplicationContext applicationContext;

    protected MibAwareSnmpVisitor osxSnmpVisitor;
    protected ShellVisitor        osxBashVisitor;

    protected SshVisitor          linuxSshVisitor;
    protected MibAwareSnmpVisitor linuxSnmpVisitor;

    protected MibAwareSnmpVisitor windowsSnmpVisitor;

    protected SshVisitor          aixSshVisitor;
    protected MibAwareSnmpVisitor aixSnmpVisitor;

    @Before
    public void setUp() throws Exception {
        EasyMock.expect(serviceRegistry.getService(GlobalClassLoader.class)).andReturn(globalClassLoader);
        EasyMock.replay(serviceRegistry);
        resolveMetaModels();

        ResourceNode devNode = new ResourceNode();
        Device dev = new Device();
        dev.setType("/device/host/linux");
      //  dev.setAddress("ci.dev.itsnow.com");
        dev.setAddress("172.16.6.72");
      //  dev.setAddress("192.168.153.130");
        devNode.setResource(dev);
        SshCredential credential1 = new SshCredential();
      //  credential1.setPassword("dev@dnt");
        credential1.setUser("root");
        credential1.setPassword("root123");
        SnmpCredential credential2 = new SnmpCredential();
        try {
            linuxSshVisitor = linuxVisitorFactory.visitor(devNode, credential1);
            linuxSnmpVisitor = snmpVisitorFactory.visitor(devNode, credential2);
        } catch (EngineException e) {
            System.err.println("Can't setup linux visitor to " + dev.getAddress() + ", because of: " + e.getMessage());
        }


        {// Aix
            ResourceNode aixNode = new ResourceNode();
            Device aixDev = new Device();
            aixDev.setType("/device/host/aix");
            aixDev.setAddress("172.16.6.207");
            aixNode.setResource(aixDev);
            SshCredential credential4 = new SshCredential();
            credential4.setUser("root");
            credential4.setPassword("rootdnt");
            try {
                aixSshVisitor  = linuxVisitorFactory.visitor(aixNode, credential4);
                aixSnmpVisitor = snmpVisitorFactory.visitor(aixNode , new SnmpCredential());
            } catch (EngineException e) {
                System.err.println("Can't setup aix visitor to " + aixDev.getAddress() + ", because of: " + e.getMessage());
            }
        }

        ResourceNode localNode = new ResourceNode();
        Device localhost = new Device();
        localhost.setType("/device/host/osx");
        localhost.setAddress("localhost");
        localNode.setResource(localhost);
        LocalCredential credential3 = new LocalCredential();
        osxBashVisitor = localVisitorFactory.visitor(localNode, credential3);
        osxSnmpVisitor = snmpVisitorFactory.visitor(localNode, credential2);


        ResourceNode windowsNode = new ResourceNode();
        Device windowsHost = new Device();
        windowsHost.setType("/device/host/windows");
        windowsHost.setAddress("192.168.12.77");    //孟杰的开发用机
        windowsNode.setResource(windowsHost);
        try {
            windowsSnmpVisitor = snmpVisitorFactory.visitor(windowsNode, credential2);
        } catch (EngineException e) {
            System.err.println("Can't setup windows visitor to " + windowsHost.getAddress() + ", because of: " + e.getMessage());
        }

        applicationContext.publishEvent(new SystemStartedEvent(componentContext));
    }

    protected void resolveMetaModels() throws MetaException {
        metaService.resolve(ManagedObject.class);
        metaService.resolve(Resource.class);
        metaService.resolve(Component.class);
        metaService.resolve(Link.class);
        metaService.resolve(Device.class);
    }

    @After
    public void tearDown() throws Exception {
        EasyMock.reset(serviceRegistry);
        snmpVisitorFactory.returnBack(osxSnmpVisitor);
        localVisitorFactory.returnBack(osxBashVisitor);

        snmpVisitorFactory.returnBack(linuxSnmpVisitor);
        linuxVisitorFactory.returnBack(linuxSshVisitor);

        snmpVisitorFactory.returnBack(windowsSnmpVisitor);
        snmpVisitorFactory.returnBack(aixSnmpVisitor);
        aixVisitorFactory.returnBack(aixSshVisitor);
    }
}
