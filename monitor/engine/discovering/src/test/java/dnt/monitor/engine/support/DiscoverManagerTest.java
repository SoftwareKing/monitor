package dnt.monitor.engine.support;

import dnt.monitor.engine.service.IpServiceDiscover;
import dnt.monitor.engine.service.ResourceDiscover;
import dnt.monitor.engine.service.SampleService;
import dnt.monitor.engine.service.VisitorFactory;
import dnt.monitor.model.*;
import dnt.monitor.service.MetaService;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.model.IpRange;
import net.happyonroad.model.SubnetRange;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.ParseUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.easymock.EasyMock.*;
import static org.junit.Assert.assertTrue;

//@Ignore("Linux CI is not ready")
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = DiscoverManagerConfig.class)
public class DiscoverManagerTest {
    @Autowired
    MetaService                    metaService;
    @Autowired
    DiscoverManager                discoverManager;
    @Autowired
    ComponentContext               componentContext;
    @Autowired
    Map<String, IpServiceDiscover> discovers;
    @Autowired
    Map<String, ResourceDiscover>  resourceDiscovers;
    @Autowired
    Map<String, VisitorFactory>    factories;
    @Autowired
    Map<String, SampleService>     sampleServices;
    @Autowired
    ApplicationContext             applicationContext;
    @Autowired
    GlobalClassLoader              globalClassLoader;

    @Autowired
    DefaultNodeStore nodeStore;
    String  localAddress = IpUtils.getLocalAddresses().iterator().next();
    IpRange range        = IpRange.parse(localAddress + "/24")[0];

    @Before
    public void setUp() throws Exception {
        String appHome = System.getProperty("java.io.tmpdir");
        System.setProperty("app.home", appHome);
        //noinspection ResultOfMethodCallIgnored
        new File(appHome, "config").mkdir();
        metaService.resolve(ManagedObject.class);
        metaService.resolve(Resource.class);
        metaService.resolve(Component.class);
        metaService.resolve(Link.class);
        metaService.resolve(Device.class);
        metaService.resolve(Host.class);
        metaService.resolve(OsxHost.class);
        metaService.resolve(LinuxHost.class);
        metaService.resolve(Nginx.class);
        metaService.resolve(MySql.class);
        metaService.resolve(Redis.class);
        expect(discoverManager.serviceRegistry.getServices(VisitorFactory.class)).andStubReturn(factories);
        expect(discoverManager.serviceRegistry.getServices(SampleService.class)).andStubReturn(sampleServices);
        expect(discoverManager.serviceRegistry.getServices(IpServiceDiscover.class)).andStubReturn(discovers);
        expect(discoverManager.serviceRegistry.getServices(ResourceDiscover.class)).andStubReturn(resourceDiscovers);
        expect(discoverManager.serviceRegistry.getService(GlobalClassLoader.class)).andStubReturn(globalClassLoader);
        expect(componentContext.getApplicationFeatures()).andStubReturn(new ArrayList<ApplicationContext>());
        replay(discoverManager.serviceRegistry);
        replay(componentContext);
        discoverManager.start();
        nodeStore.start();
        SystemStartedEvent event = new SystemStartedEvent(componentContext);
        applicationContext.publishEvent(event);
    }

    @After
    public void tearDown() throws Exception {
        reset(discoverManager.serviceRegistry);
        reset(componentContext);
    }

    @Test
    public void testSearchDevices() throws Exception {
        Device[] devices = discoverManager.searchDevices(range);
        for (Device device : devices) {
            System.out.printf("%s:%s\n", device.getAddress(), StringUtils.join(device.getServices(), ","));
        }
        assertTrue(devices.length > 0);
    }

    @Test
    public void testSearchBlocks() throws Exception {
        IpRange range = new SubnetRange("172.16.7.0/24");
        Device[] devices = discoverManager.searchDevices(range);
        for (Device device : devices) {
            System.out.printf("%s:%s\n", device.getAddress(), StringUtils.join(device.getServices(), ","));
        }
        assertTrue(devices.length > 0);
    }

    @Test
    public void testDiscoverRelates() throws Exception {
        List<String> addresses = new ArrayList<String>(2);
        String address1 = "192.168.12.63";
        String address2 = "172.16.3.16";
        String address3 = "172.16.3.17";
        //addresses.add(address1);
        addresses.add(address2);
        //addresses.add(address3);

        GroupNode root = new GroupNode();
        root.setPath("/");
        root.setCredentials(new SshCredential("root", new File("/Users/JayXiong/.ssh/id_rsa")));
        nodeStore.add(root);

        Host host1 = new OsxHost();
        host1.setId(1L);
        host1.setType("/device/host/osx");
        host1.setAddress(address1);
        ResourceNode node1 = new ResourceNode();
        node1.setPath("/node1");
        node1.setResourceId(1L);
        node1.setCredentials(new LocalCredential());
        nodeStore.add(node1);
        discoverManager.resourceStore.add(host1);

        Host host2 = new LinuxHost();
        host2.setId(2L);
        host2.setType("/device/host/linux");
        host2.setAddress(address2);
        discoverManager.resourceStore.add(host2);
        ResourceNode node2 = new ResourceNode();
        node2.setPath("/node2");
        node2.setResourceId(2L);
        nodeStore.add(node2);

        Host host3 = new LinuxHost();
        host3.setId(3L);
        host3.setType("/device/host/linux");
        host3.setAddress(address3);
        discoverManager.resourceStore.add(host3);
        ResourceNode node3 = new ResourceNode();
        node3.setPath("/node3");
        node3.setResourceId(3L);
        nodeStore.add(node3);

        Resource[] resources = discoverManager.discoverRelates(addresses);
        for (Resource resource : resources) {
            System.out.println(ParseUtils.toJSONString(resource));
        }
        assertTrue(resources.length > 0);
    }

/*
    @Test
    public void testSearchRange() throws Exception {
        List<String> ips = discoverManager.searchRange(range);
        System.out.println(StringUtils.join(ips, "\n"));
        assertTrue(ips.size() > 0 );
    }

    @Test
    public void testDiscoverServices() throws Exception {
        List<String> ips = discoverManager.searchRange(range);
        Map<String, List<Service>> ipToServices = discoverManager.discoverServices(ips);
        boolean foundAny = false;
        for (Map.Entry<String, List<Service>> entry : ipToServices.entrySet()) {
            System.out.printf("%s:\t%s\n", entry.getKey(), StringUtils.join(entry.getValue(),","));
            foundAny = foundAny || !entry.getValue().isEmpty();
        }
        if( !foundAny )fail("Haven't found any services");
    }
*/

}