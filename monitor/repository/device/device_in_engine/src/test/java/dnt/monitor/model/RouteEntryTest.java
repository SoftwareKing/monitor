package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@SuppressWarnings("unchecked")
public class RouteEntryTest extends DeviceSampleTest {

    MetaRelation routesRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Device.class);
        routesRelation = (MetaRelation) metaResource.getMember("routeEntries");
    }

    @Test
    public void testRetrieveLinuxRouteEntriesBySnmp() throws Exception {
        List<RouteEntry> entries = snmpSampleService.sampleEntries(linuxSnmpVisitor, routesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveLinuxRouteEntriesBySsh() throws Exception {
        List<RouteEntry> entries = shellSampleService.sampleEntries(linuxSshVisitor, routesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixRouteEntriesBySsh() throws Exception {
        List<RouteEntry> entries = shellSampleService.sampleEntries(aixSshVisitor, routesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxRouteEntriesBySnmp() throws Exception {
        List<RouteEntry> entries = snmpSampleService.sampleEntries(osxSnmpVisitor, routesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxRouteEntriesByBash() throws Exception {
        List<RouteEntry> entries = shellSampleService.sampleEntries(osxBashVisitor, routesRelation);
        validate(entries);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsRouteEntriesBySnmp() throws Exception {
        List<RouteEntry> entries = snmpSampleService.sampleEntries(windowsSnmpVisitor, routesRelation);
        validate(entries);
    }

    protected void validate(List<RouteEntry> entries) {
        assertFalse(entries.isEmpty());
        for (RouteEntry entry : entries) {
            System.out.println(ParseUtils.toJSONString(entry));
            assertTrue(entry.getIfIndex() > 0);
        }
    }
}