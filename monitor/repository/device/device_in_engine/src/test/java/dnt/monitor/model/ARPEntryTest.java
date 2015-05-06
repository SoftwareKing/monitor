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
public class ARPEntryTest extends DeviceSampleTest {

    MetaRelation arpsRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Device.class);
        arpsRelation = (MetaRelation) metaResource.getMember("arpEntries");
    }

    @Test
    public void testRetrieveLinuxARPEntriesBySnmp() throws Exception {
        List<ARPEntry> entries = snmpSampleService.sampleEntries(linuxSnmpVisitor, arpsRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveLinuxARPEntriesBySsh() throws Exception {
        List<ARPEntry> entries = shellSampleService.sampleEntries(linuxSshVisitor, arpsRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixARPEntriesBySsh() throws Exception {
        List<ARPEntry> entries = shellSampleService.sampleEntries(aixSshVisitor, arpsRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixARPEntriesBySnmp() throws Exception {
        List<ARPEntry> entries = snmpSampleService.sampleEntries(aixSnmpVisitor, arpsRelation);
        validate(entries);
    }


    @Test
    public void testRetrieveOsxARPEntriesBySnmp() throws Exception {
        List<ARPEntry> entries = snmpSampleService.sampleEntries(osxSnmpVisitor, arpsRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxARPEntriesByBash() throws Exception {
        List<ARPEntry> entries = shellSampleService.sampleEntries(osxBashVisitor, arpsRelation);
        validate(entries);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsARPEntriesBySnmp() throws Exception {
        List<ARPEntry> entries = snmpSampleService.sampleEntries(windowsSnmpVisitor, arpsRelation);
        validate(entries);
    }

    protected void validate(List<ARPEntry> entries) {
        assertFalse(entries.isEmpty());
        for (ARPEntry entry : entries) {
            System.out.println(ParseUtils.toJSONString(entry));
            assertTrue(entry.getIfIndex() >= 0);
        }
    }
}