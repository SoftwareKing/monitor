package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

@SuppressWarnings("unchecked")
public class DiskTest extends HostTestBase {

    MetaRelation disksRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Host.class);
        disksRelation = (MetaRelation) metaResource.getMember("disks");
    }

    @Test
    @Ignore("暂时没找到通过SNMP采集主机 Disk 等硬件的mib库")
    public void testRetrieveLinuxDisksBySnmp() throws Exception {
        List<Disk> entries = snmpSampleService.sampleComponents(linuxSnmpVisitor, disksRelation);
        validate(entries, false);
    }

    @Test
    public void testRetrieveLinuxDisksBySsh() throws Exception {
        List<Disk> entries = shellSampleService.sampleComponents(linuxSshVisitor, disksRelation);
        validate(entries, false);
    }

    @Test
    public void testRetrieveAixDisksBySsh() throws Exception {
        List<Disk> entries = shellSampleService.sampleComponents(aixSshVisitor, disksRelation);
        validate(entries, false);
    }

    @Test
    @Ignore("暂时没找到通过SNMP采集主机 Disk 等硬件的mib库")
    public void testRetrieveOsxDisksBySnmp() throws Exception {
        List<Disk> entries = snmpSampleService.sampleComponents(osxSnmpVisitor, disksRelation);
        validate(entries, false);
    }

    @Ignore("虽然找到了osx的磁盘命令: iostat -do，但其输出结构为横表，如何转换/解析还是个问题")
    @Test
    public void testRetrieveOsxDisksByBash() throws Exception {
        List<Disk> entries = shellSampleService.sampleComponents(osxBashVisitor, disksRelation);
        assertTrue(entries.isEmpty());
    }


    protected void validate(List<Disk> disks, boolean osx) {
        assertFalse(disks.isEmpty());
        for (Disk disk : disks) {
            validate(disk, osx);
        }
    }

    private void validate(Disk disk, boolean osx) {
        System.out.println(ParseUtils.toJSONString(disk));
        assertNotNull(disk.getLabel());
        assertNotNull(disk.getRbps());
        assertNotNull(disk.getWbps());
        assertNotNull(disk.getTps());

//        assertNotNull(disk.getRps());
//        assertNotNull(disk.getTbps());
//        assertNotNull(disk.getWps());
    }
}