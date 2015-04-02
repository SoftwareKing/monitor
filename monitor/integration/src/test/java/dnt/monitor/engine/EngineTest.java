/**
 * Developer: Kadvin Date: 15/1/26 下午4:14
 */
package dnt.monitor.engine;

import dnt.monitor.it.AbstractTest;
import dnt.monitor.model.*;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import org.junit.Before;

import java.sql.Timestamp;
import java.util.*;

/**
 * The engine integration test case base
 */
public class EngineTest extends AbstractTest {
    protected MonitorEngine engine;

    @Before
    public void setUp() throws Exception {
        engine = new MonitorEngine();
        engine.setAddress("192.168.10.101");
        engine.setHome("/path/to/started/engine");
        engine.setName("test");
        engine.setLabel("测试引擎");
        Set<Integer> pids = new HashSet<Integer>();
        pids.add(1023);
        pids.add(1024);
        pids.add(1025);
        pids.add(1026);
        engine.setPids(pids);

        LinuxHost host = new LinuxHost();

        engine.setHost(host);

        host.setType("/device/host/linux");
        host.setAddress(engine.getAddress());
        host.setLabel(host.getAddress());
        host.setDescription("A test host");
        host.setPerformance(Performance.Normal);
        host.setConfigStatus(ConfigStatus.Changed);
        host.setAvailability(Availability.Unavailable);
        host.setHostname("it-test-host");
        host.setManufacturer("Dell");
        host.setModelName("Dell 2800");
        host.setOs("Windows 2003 Server");
        host.setVersion("2003.12");
        host.setSerialNumber("1203920");
        host.setDomain("workstation");
        host.setCpuCount(4);
        host.setStartAt(new Date(System.currentTimeMillis() - 12802020));
        host.setUpTime("sometime");
        host.setLocalTime(new Timestamp(System.currentTimeMillis()));
        host.setProcessCount(100);
        host.setProperty("creator", "integration");

        host.setCPU(createCPU(0, Performance.Warning));

        List<CPU> cpus = new ArrayList<CPU>();
        cpus.add(createCPU(1, Performance.Normal));
        cpus.add(createCPU(2, Performance.Critical));
        host.setCPUs(cpus);
    }

    CPU createCPU(int i, Performance performance) {
        CPU cpu = new CPU();
        cpu.setIdx(i);
        cpu.setModelName("Intel Xeron");
        cpu.setFrequency(1024f);
        cpu.setUsage(0.7f);
        cpu.setUsrUsage(0.6f);
        cpu.setSysUsage(0.1f);
        cpu.setIdle(0.3f);
        cpu.setIoWait(0.1f);
        cpu.setPerformance(performance);
        cpu.setConfigStatus(ConfigStatus.Unchanged);
        cpu.setAvailability(Availability.Available);
        return cpu;
    }
}
