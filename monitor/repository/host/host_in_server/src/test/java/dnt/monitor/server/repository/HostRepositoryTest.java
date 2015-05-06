package dnt.monitor.server.repository;

import dnt.monitor.model.Host;
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

import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

@ContextConfiguration(classes = HostRepositoryConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
public class HostRepositoryTest {
    @Autowired
    HostRepository<Host> repository;

    Host host;

    @Before
    public void setUp() throws Exception {
        host = new Host();
        host.setType("/device/host/linux");
        host.setAddress("192.168.10.199");
        host.setLabel(host.getAddress());
        host.setDescription("A test host");
        host.setPerformance(Performance.Normal);
        host.setConfigStatus(ConfigStatus.Changed);
        host.setAvailability(Availability.Unavailable);
        host.setModelName("Dell 2800");
        host.setOs("Windows 2003 Server");
        host.setVersion("2003.12");
        host.setSerialNumber("1203920");
        host.setDomain("workstation");
        host.setUpTime("long long ago");
        host.setLocalTime(new Date());
        host.setProperty("test", "value");
    }

    @After
    public void tearDown() throws Exception {
        if (host.getId() != null) repository.deleteById(host.getId());
    }

    @Test
    public void testCountByKeyword() throws Exception {
        long count = repository.countByKeyword("srv1");
        assertEquals(1, count);
    }

    @Test
    public void testFindAllByKeyword() throws Exception {
        List<Host> hosts = repository.findAllByKeyword("Dell", new PageRequest(0, 10));
        assertEquals(2, hosts.size());
        Host host = hosts.get(0);
        assertEquals("CentOS release 6.5 (Final)", host.getOs());
        assertNull(host.getCPU());
        assertNull(host.getCPUs());
        assertNull(host.getMemory());
        assertNull(host.getDisks());
        assertNull(host.getPartitions());
        assertNull(host.getInterfaces());
    }

    @Test
    public void testFindById() throws Exception {
        Host host = repository.findById(4L);
        assertEquals("CentOS release 6.5 (Final)", host.getOs());
        assertNotNull(host.getCPU());
        assertEquals(new Float(0.4725), host.getCPU().getUsage());
        assertNotNull(host.getMemory());
        assertEquals(new Integer(12288), host.getMemory().getTotal());
        assertFalse(host.getCPUs().isEmpty());
        assertFalse(host.getDisks().isEmpty());
        assertFalse(host.getPartitions().isEmpty());
        assertFalse(host.getInterfaces().isEmpty());
        assertFalse(host.getOutLinks().isEmpty());
        assertFalse(host.getInLinks().isEmpty());
    }

    @Test
    public void testFindByAddress() throws Exception {
        Host host = repository.findByAddress("172.16.1.10");
        assertEquals("CentOS release 6.5 (Final)", host.getOs());
        assertNotNull(host.getCPU());
        assertEquals(new Float(0.4725), host.getCPU().getUsage());
        assertNotNull(host.getMemory());
        assertEquals(new Integer(12288), host.getMemory().getTotal());
        assertFalse(host.getCPUs().isEmpty());
        assertFalse(host.getDisks().isEmpty());
        assertFalse(host.getPartitions().isEmpty());
        assertFalse(host.getInterfaces().isEmpty());
    }

    /**
     * 测试创建主机，应该会填充 resources表 + t_hosts表
     * @throws Exception
     */
    @Test
    //@Ignore("H2 Not support multiple SQL statements; see: org.h2.command.Parser line#275 ")
    public void testCreate() throws Exception {
        repository.create(host);
        assertNotNull(host.getId());

        Host created = repository.findById(host.getId());
        assertEquals(host, created);
    }

    /**
     * 测试创建CPU，应该会填充 components表 + t_cpus表
     * @throws Exception
     */
    @Test
    public void testCreateCPU() throws Exception {


    }

    /**
     * 测试创建Memory，应该会填充 components表 + t_memories表
     * @throws Exception
     */
    @Test
    public void testCreateMemory() throws Exception {


    }

    /**
     * 测试创建Disk，应该会填充 components表 + t_disks表
     * @throws Exception
     */
    @Test
    public void testCreateDisk() throws Exception {


    }
    /**
     * 测试创建Partition，应该会填充 components表 + t_partitions表
     * @throws Exception
     */
    @Test
    public void testCreatePartition() throws Exception {


    }
    /**
     * 测试创建NIC，应该会填充 components表 + t_nics表
     * @throws Exception
     */
    @Test
    public void testCreateNIC() throws Exception {


    }
}