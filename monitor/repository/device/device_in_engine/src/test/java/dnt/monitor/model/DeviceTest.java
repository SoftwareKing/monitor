package dnt.monitor.model;

import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@SuppressWarnings("unchecked")
public class DeviceTest extends DeviceSampleTest {

    private MetaResource metaResource;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        metaResource = metaService.getMetaResource(Device.class);
    }

    @Test
    public void testRetrieveLinuxAsDeviceBySnmp() throws Exception {
        Device device = (Device) snmpSampleService.sampleResource(linuxSnmpVisitor, metaResource);
        validate(device);
    }

    @Test
     public void testRetrieveLinuxAsDeviceBySsh() throws Exception {
        Device device = (Device) shellSampleService.sampleResource(linuxSshVisitor, metaResource);
        validate(device);
    }

    @Test
    public void testRetrieveAixAsDeviceBySsh() throws Exception {
        Device device = (Device) shellSampleService.sampleResource(aixSshVisitor, metaResource);
        validate(device);
    }

    @Test
    public void testRetrieveOsxAsDeviceBySnmp() throws Exception {
        Device device = (Device) snmpSampleService.sampleResource(osxSnmpVisitor, metaResource);
        validate(device);
    }

    @Test
    public void testRetrieveOsxAsDeviceByBash() throws Exception {
        Device device = (Device) shellSampleService.sampleResource(osxBashVisitor, metaResource);
        validate(device);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsAsDeviceBySnmp() throws Exception {
        Device device = (Device) snmpSampleService.sampleResource(windowsSnmpVisitor, metaResource);
        validate(device);
    }

    protected void validate(Device device) {
        assertNotNull(device);
        System.out.println(ParseUtils.toJSONString(device));
        // keyed components
        assertFalse(device.getInterfaces().isEmpty());
        // keyed entries
        assertNotNull(device.getAddresses());
        assertTrue(device.getAddresses().length > 0);

        assertNotNull(device.getRouteEntries());
        assertTrue(device.getRouteEntries().length > 0);

    }
}