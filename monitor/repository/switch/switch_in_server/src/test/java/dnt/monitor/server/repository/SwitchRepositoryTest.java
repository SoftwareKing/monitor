package dnt.monitor.server.repository;

import dnt.monitor.model.AddressEntry;
import dnt.monitor.model.CdpEntry;
import dnt.monitor.model.Switch;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = SwitchRepositoryConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
public class SwitchRepositoryTest {
    @Autowired
    SwitchRepository<Switch> repository;

    Switch theSwitch;

    @Before
    public void setUp() throws Exception {
        theSwitch = new Switch();
        theSwitch.setType("/device/switch");
        theSwitch.setAddress("192.168.10.199");
        theSwitch.setLabel(theSwitch.getAddress());
        theSwitch.setDescription("A test host");
        theSwitch.setPerformance(Performance.Normal);
        theSwitch.setConfigStatus(ConfigStatus.Changed);
        theSwitch.setAvailability(Availability.Unavailable);
        theSwitch.setUpTime("long long ago");
        theSwitch.setProperty("test", "value");
        theSwitch.setType("/device/host");
        theSwitch.setAddress("192.168.10.199");
        AddressEntry[] addresses = new AddressEntry[2];
        addresses[0] = new AddressEntry();
        addresses[0].setAddr("192.168.10.198");
        addresses[1] = new AddressEntry();
        addresses[0].setAddr("192.168.10.197");
        theSwitch.setAddresses(addresses);
        theSwitch.setLabel(theSwitch.getAddress());
        theSwitch.setDescription("A test device");
        theSwitch.setPerformance(Performance.Normal);
        theSwitch.setConfigStatus(ConfigStatus.Changed);
        theSwitch.setAvailability(Availability.Unavailable);
        theSwitch.setUpTime("any time");
        theSwitch.setProperty("test", "value");
        CdpEntry[] cdpEntries = new CdpEntry[1];
        cdpEntries[0] = new CdpEntry();
        cdpEntries[0].setAddress("ac 10 01 fc");
        cdpEntries[0].setAddressType(4);
        cdpEntries[0].setVersion("Cisco Internetwork Operating System Software \n" +
                                 "IOS (tm) s222_rp Software (s222_rp-IPSERVICESK9_WAN-M), Version 12.2(18)SXF7, RELEASE SOFTWARE (fc1)\n" +
                                 "Technical Support: http://www.cisco.com/techsupport\n" +
                                 "Copyright (c) 1986-2006 by cisco Systems, Inc.\n" +
                                 "Compiled Thu 23-Nov-06 02:23 by kellythw");
        cdpEntries[0].setDeviceId("DNT(6509-2).dnt.com.cn");
        cdpEntries[0].setDevicePort("GigabitEthernet1/1");
        cdpEntries[0].setPlatform("cisco WS-C6509");
        cdpEntries[0].setCapabilities("00 00 00 29");
        cdpEntries[0].setNativeVLAN(1);

        theSwitch.setCdpEntries(cdpEntries);
    }

    @After
    public void tearDown() throws Exception {
        if (theSwitch.getId() != null) repository.deleteById(theSwitch.getId());
    }

    /**
     * 测试创建主机，应该会填充 resources表 + t_hosts表
     * @throws Exception
     */
    @Test
    public void testCreate() throws Exception {
        repository.create(theSwitch);
        assertNotNull(theSwitch.getId());

        Switch created = repository.findById(theSwitch.getId());
        assertEquals(theSwitch, created);
        assertNotNull(created.getCdpEntries());
        assertEquals(1, created.getCdpEntries().length);
    }
}