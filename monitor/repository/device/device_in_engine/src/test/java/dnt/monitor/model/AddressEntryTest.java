package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;
import java.util.List;
import static org.junit.Assert.assertFalse;

@SuppressWarnings("unchecked")
public class AddressEntryTest extends DeviceSampleTest {
    MetaRelation addressesRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Device.class);
        addressesRelation = (MetaRelation) metaResource.getMember("addresses");
    }

    @Test
    public void testRetrieveLinuxAddressEntriesBySnmp() throws Exception {
        List<AddressEntry> entries = snmpSampleService.sampleEntries(linuxSnmpVisitor, addressesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveLinuxAddressEntriesBySsh() throws Exception {
        List<AddressEntry> entries = shellSampleService.sampleEntries(linuxSshVisitor, addressesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixAddressEntriesBySnmp() throws Exception {
        List<AddressEntry> entries = snmpSampleService.sampleEntries(aixSnmpVisitor, addressesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixAddressEntriesBySsh() throws Exception {
        List<AddressEntry> entries = shellSampleService.sampleEntries(aixSshVisitor, addressesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxAddressEntriesBySnmp() throws Exception {
        List<AddressEntry> entries = snmpSampleService.sampleEntries(osxSnmpVisitor, addressesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxAddressEntriesByBash() throws Exception {
        List<AddressEntry> entries = shellSampleService.sampleEntries(osxBashVisitor, addressesRelation);
        validate(entries);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsAddressEntriesBySnmp() throws Exception {
        List<AddressEntry> entries = snmpSampleService.sampleEntries(windowsSnmpVisitor, addressesRelation);
        validate(entries);
    }

    protected void validate(List<AddressEntry> entries) {
        assertFalse(entries.isEmpty());
        for (AddressEntry entry : entries) {
            System.out.println(ParseUtils.toJSONString(entry));
            assertFalse(entry.getNetMask().isEmpty());
        }
    }
}