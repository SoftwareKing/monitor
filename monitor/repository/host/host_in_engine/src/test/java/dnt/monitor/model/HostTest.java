package dnt.monitor.model;

import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import net.happyonroad.util.StringUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

@SuppressWarnings("unchecked")
public class HostTest extends HostTestBase {

    private MetaResource metaResource;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        metaResource = metaService.getMetaResource(Host.class);
    }

    @Test
    public void testRetrieveLinuxAsHostBySnmp() throws Exception {
        Host host = (Host) snmpSampleService.sampleResource(linuxSnmpVisitor, metaResource);
        validate(host, true);
    }

    @Test
    public void testRetrieveLinuxAsHostBySsh() throws Exception {
        Host host = (Host) shellSampleService.sampleResource(linuxSshVisitor, metaResource);
        validate(host, false);
    }

    @Test
    public void testRetrieveAixAsHostBySsh() throws Exception {
        Host host = (Host) shellSampleService.sampleResource(aixSshVisitor, metaResource);
        validate(host, false);
    }

    @Test
    public void testRetrieveOsxAsHostBySnmp() throws Exception {
        Host host = (Host) snmpSampleService.sampleResource(osxSnmpVisitor, metaResource);
        validate(host, true);
    }

    @Test
    public void testRetrieveOsxAsHostByBash() throws Exception {
        Host host = (Host) shellSampleService.sampleResource(osxBashVisitor, metaResource);
        validate(host, false);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsAsHostBySnmp() throws Exception {
        Host host = (Host) snmpSampleService.sampleResource(windowsSnmpVisitor, metaResource);
        validate(host, true);
    }

    protected void validate(Host host, boolean snmp) {
        assertNotNull(host);
        System.out.println(ParseUtils.toJSONString(host));
        assertNotNull(host.getUpTime());
        assertNotNull(host.getLabel());
        if (snmp) {
            assertNotNull(host.getLocation());
            assertNotNull(host.getContact());
            assertNotNull(host.getObjectID());
        } else {
            //assertNotNull(host.getStartAt());
            assertNotNull(host.getLocalTime());
            assertNotNull(host.getProcessCount());
            //assertNotNull(host.getCpuCount());
            assertNotNull(host.getDescription());
        }

        // keyed components
        assertFalse(host.getInterfaces().isEmpty());
        // keyed entries
        assertNotNull(host.getAddresses());
        assertTrue(host.getAddresses().length > 0);

        assertNotNull(host.getRouteEntries());
        assertTrue(host.getRouteEntries().length > 0);

    }
}