package dnt.monitor.server.repository;

import dnt.monitor.model.AddressEntry;
import dnt.monitor.model.Device;
import net.happyonroad.platform.util.PageRequest;
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

import java.util.List;

import static org.junit.Assert.*;
import static org.junit.Assert.assertFalse;

@ContextConfiguration(classes = DeviceRepositoryConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class DeviceRepositoryTest {
    @Autowired
    DeviceRepository<Device> repository;

    Device device;

    @Before
    public void setUp() throws Exception {
        device = new Device();
        device.setType("/device/host");
        device.setAddress("192.168.10.199");
        AddressEntry[] addresses = new AddressEntry[2];
        addresses[0] = new AddressEntry();
        addresses[0].setAddr("192.168.10.198");
        addresses[1] = new AddressEntry();
        addresses[0].setAddr("192.168.10.197");
        device.setAddresses(addresses);
        device.setLabel(device.getAddress());
        device.setDescription("A test device");
        device.setPerformance(Performance.Normal);
        device.setConfigStatus(ConfigStatus.Changed);
        device.setAvailability(Availability.Unavailable);
        device.setUpTime("any time");
        device.setProperty("test", "value");
    }

    @After
    public void tearDown() throws Exception {
        if (device.getId() != null) repository.deleteById(device.getId());
    }

    @Test
    public void testCountByKeyword() throws Exception {
        long count = repository.countByKeyword("device-srv1");
        assertEquals(1, count);
    }

    @Test
    public void testFindContainsAddress() throws Exception {
        Device device = repository.findWithAddress("192.168.12.84");
        validateDevice(device);
    }

    @Test
    public void testFindAllByKeyword() throws Exception {
        List<Device> devices = repository.findAllByKeyword("China", new PageRequest(0, 10));
        assertEquals(2, devices.size());
        Device device = devices.get(0);
        assertEquals("Someone", device.getContact());
        assertNull(device.getInterfaces());
    }

    @Test
    public void testFindById() throws Exception {
        Device device = repository.findById(4L);
        validateDevice(device);
    }

    @Test
    public void testFindByAddress() throws Exception {
        Device device = repository.findByAddress("172.16.1.10");
        validateDevice(device);
    }

    protected void validateDevice(Device device) {
        assertEquals("Someone", device.getContact());
        assertFalse(device.getInterfaces().isEmpty());
        assertFalse(device.getOutLinks().isEmpty());
        assertFalse(device.getInLinks().isEmpty());
        assertNotNull(device.getAddresses());
    }
}