package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertFalse;

@SuppressWarnings("unchecked")
public class TcpEntryTest extends DeviceSampleTest {
    MetaRelation tcpEntriesRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Device.class);
        tcpEntriesRelation = (MetaRelation) metaResource.getMember("tcpEntries");
    }

    @Test
    public void testRetrieveLinuxTcpEntriesBySnmp() throws Exception {
        List<TcpEntry> entries = snmpSampleService.sampleEntries(linuxSnmpVisitor, tcpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveLinuxTcpEntriesBySsh() throws Exception {
        List<TcpEntry> entries = shellSampleService.sampleEntries(linuxSshVisitor, tcpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixTcpEntriesBySsh() throws Exception {
        List<TcpEntry> entries = shellSampleService.sampleEntries(aixSshVisitor, tcpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxTcpEntriesBySnmp() throws Exception {
        List<TcpEntry> entries = snmpSampleService.sampleEntries(osxSnmpVisitor, tcpEntriesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxTcpEntriesByBash() throws Exception {
        List<TcpEntry> entries = shellSampleService.sampleEntries(osxBashVisitor, tcpEntriesRelation);
        validate(entries);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsTcpEntriesBySnmp() throws Exception {
        List<TcpEntry> entries = snmpSampleService.sampleEntries(windowsSnmpVisitor, tcpEntriesRelation);
        validate(entries);
    }

    protected void validate(List<TcpEntry> entries) {
        assertFalse(entries.isEmpty());
        for (TcpEntry entry : entries) {
            System.out.println(ParseUtils.toJSONString(entry));
       //     validate(entry);
        }
    }

    protected void validate(TcpEntry entry) {
        assertFalse(entry.getLocalAddress().isEmpty());
        assertFalse(entry.getLocalPort().isEmpty());
        assertFalse(entry.getRemAddress().isEmpty());
        assertFalse(entry.getRemPort().isEmpty());
    }
}