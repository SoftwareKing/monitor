package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertFalse;

@SuppressWarnings("unchecked")
public class UdpEntryTest extends DeviceSampleTest {
    MetaRelation udpEntriesRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Device.class);
        udpEntriesRelation = (MetaRelation) metaResource.getMember("udpEntries");
    }

    @Test
    public void testRetrieveLinuxUdpEntriesBySnmp() throws Exception {
        List<UdpEntry> entries = snmpSampleService.sampleEntries(linuxSnmpVisitor, udpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveLinuxUdpEntriesBySsh() throws Exception {
        List<UdpEntry> entries = shellSampleService.sampleEntries(linuxSshVisitor, udpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixUdpEntriesBySsh() throws Exception {
        List<UdpEntry> entries = shellSampleService.sampleEntries(aixSshVisitor, udpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxUdpEntriesBySNMP() throws Exception {
        List<UdpEntry> entries = snmpSampleService.sampleEntries(osxSnmpVisitor, udpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxUdpEntriesByBash() throws Exception {
        List<UdpEntry> entries = shellSampleService.sampleEntries(osxBashVisitor, udpEntriesRelation);
        validate(entries);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsUdpEntriesBySNMP() throws Exception {
        List<UdpEntry> entries = snmpSampleService.sampleEntries(windowsSnmpVisitor, udpEntriesRelation);
        validate(entries);
    }

    protected void validate(List<UdpEntry> entries) {
        assertFalse(entries.isEmpty());
        for (UdpEntry entry : entries) {
            System.out.println(ParseUtils.toJSONString(entry));
            validate(entry);
        }
    }

    protected void validate(UdpEntry entry) {
        assertFalse(entry.getLocalAddress().isEmpty());
        assertFalse(entry.getLocalPort().isEmpty());
    }
}