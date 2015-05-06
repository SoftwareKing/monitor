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
public class NICTest extends DeviceSampleTest {

    MetaRelation interfacesRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Device.class);
        interfacesRelation = (MetaRelation) metaResource.getMember("interfaces");
    }

    @Test
    public void testRetrieveLinuxInterfacesBySnmp() throws Exception {
        List<NIC> entries = snmpSampleService.sampleEntries(linuxSnmpVisitor, interfacesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveLinuxInterfacesBySsh() throws Exception {
        List<NIC> entries = shellSampleService.sampleEntries(linuxSshVisitor, interfacesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveAixInterfacesBySsh() throws Exception {
        List<NIC> entries = shellSampleService.sampleEntries(aixSshVisitor, interfacesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxInterfacesBySnmp() throws Exception {
        List<NIC> entries = snmpSampleService.sampleEntries(osxSnmpVisitor, interfacesRelation);
        validate(entries);
    }

    @Test
    public void testRetrieveOsxInterfacesByBash() throws Exception {
        List<NIC> entries = shellSampleService.sampleEntries(osxBashVisitor, interfacesRelation);
        validate(entries);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsInterfacesBySnmp() throws Exception {
        List<NIC> entries = snmpSampleService.sampleEntries(windowsSnmpVisitor, interfacesRelation);
        validate(entries);
    }

    protected void validate(List<NIC> entries) {
        assertFalse(entries.isEmpty());
        for (NIC entry : entries) {
            System.out.println(ParseUtils.toJSONString(entry));            
      //      assertTrue(entry.getIndex() > 0 );
            assertFalse(entry.getLabel().isEmpty());
        }
    }
}