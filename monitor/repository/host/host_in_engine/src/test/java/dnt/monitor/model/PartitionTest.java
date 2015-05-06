package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

@SuppressWarnings("unchecked")
public class PartitionTest extends HostTestBase {

    MetaRelation partitionsRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Host.class);
        partitionsRelation = (MetaRelation) metaResource.getMember("partitions");
    }

    @Test
    public void testRetrieveLinuxPartitionsBySnmp() throws Exception {
        List<Partition> entries = snmpSampleService.sampleComponents(linuxSnmpVisitor, partitionsRelation);
        validate(entries, true,false);
    }

    @Test
    public void testRetrieveLinuxPartitionsBySsh() throws Exception {
        List<Partition> entries = shellSampleService.sampleComponents(linuxSshVisitor, partitionsRelation);
        validate(entries, false,false);
    }

    @Test
    public void testRetrieveAixPartitionsBySsh() throws Exception {
        List<Partition> entries = shellSampleService.sampleComponents(aixSshVisitor, partitionsRelation);
        validate(entries, false,false);
    }

    @Test
    @Ignore("暂时没找到通过SNMP采集主机 Partition 等硬件的mib库")
    public void testRetrieveOsxPartitionsBySnmp() throws Exception {
        List<Partition> entries = snmpSampleService.sampleComponents(osxSnmpVisitor, partitionsRelation);
        validate(entries, true,true);
    }

    @Test
    public void testRetrieveOsxPartitionsByBash() throws Exception {
        List<Partition> entries = shellSampleService.sampleComponents(osxBashVisitor, partitionsRelation);
        validate(entries, false,true);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsPartitionsBySnmp() throws Exception {
        List<Partition> entries = snmpSampleService.sampleComponents(windowsSnmpVisitor, partitionsRelation);
        validate(entries, true,false);
    }


    protected void validate(List<Partition> partitions, boolean snmp,boolean osx) {
        assertFalse(partitions.isEmpty());
        for (Partition partition : partitions) {
            validate(partition, snmp,osx);
        }
    }

    private void validate(Partition partition, boolean snmp ,boolean osx) {
        System.out.println(ParseUtils.toJSONString(partition));
        if (!snmp && !osx) {
            assertNotNull(partition.getMountPoint());
        }
        assertNotNull(partition.getLabel());
        assertNotNull(partition.getTotal());
        assertNotNull(partition.getUsed());
        assertNotNull(partition.getFree());
        assertNotNull(partition.getCapacity());
        assertNotNull(partition.getUsage());
        assertNotNull(partition.getFsType());
    }
}