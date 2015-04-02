package dnt.monitor.engine.support;

import dnt.monitor.model.Device;
import dnt.monitor.model.RangeNode;
import net.happyonroad.model.IpRange;
import net.happyonroad.model.SubnetRange;
import net.happyonroad.util.IpUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@Ignore("Linux CI is not ready")
public class DiscoverManagerTest {
    DiscoverManager discoverManager = new DiscoverManager();

    String localAddress = IpUtils.getLocalAddresses().iterator().next();
    IpRange range = IpRange.parse(localAddress + "/24")[0];

    @Before
    public void setUp() throws Exception {
        String appHome = System.getProperty("java.io.tmpdir");
        System.setProperty("app.home", appHome);
        //noinspection ResultOfMethodCallIgnored
        new File(appHome, "config").mkdir();
        discoverManager.start();
        discoverManager.onApplicationEvent(null);
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