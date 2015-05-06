package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

@SuppressWarnings("unchecked")
public class CPUTest extends HostTestBase {

    MetaRelation cpuRelation;
    MetaRelation cpusRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Host.class);
        cpuRelation  = (MetaRelation) metaResource.getMember("CPU") ;
        cpusRelation = (MetaRelation) metaResource.getMember("CPUs");        
    }

    @Test
    public void testRetrieveLinuxCPUsBySnmp() throws Exception {
        List<CPU> entries = snmpSampleService.sampleComponents(linuxSnmpVisitor, cpusRelation);
        validate(entries, false, true);
    }

    @Test
    public void testRetrieveLinuxCPUBySnmp() throws Exception {
        CPU cpu = (CPU) snmpSampleService.sampleComponent(linuxSnmpVisitor, cpuRelation);
        validate(cpu, false, true);
    }

    @Test
    public void testRetrieveLinuxCPUsBySsh() throws Exception {
        List<CPU> entries = shellSampleService.sampleComponents(linuxSshVisitor, cpusRelation);
        validate(entries, false, false);
    }

    @Test
    public void testRetrieveLinuxCPUBySsh() throws Exception {
        CPU cpu = (CPU) shellSampleService.sampleComponent(linuxSshVisitor, cpuRelation);
        validate(cpu, false, false);
    }

    @Test
    public void testRetrieveAixCPUsBySsh() throws Exception {
        List<CPU> entries = shellSampleService.sampleComponents(aixSshVisitor, cpusRelation);
        validate(entries,false,false);
    }

    @Test
    public void testRetrieveAixCPUBySsh() throws Exception {
        List<CPU> entries = shellSampleService.sampleComponents(aixSshVisitor, cpuRelation);
        validate(entries,false,false);
    }


    @Test
    @Ignore("没有公用的osx主机")
    public void testRetrieveOsxCPUsBySnmp() throws Exception {
        List<CPU> entries = snmpSampleService.sampleComponents(osxSnmpVisitor, cpusRelation);
        validate(entries, true, true);
    }

    @Test
    @Ignore("没有公用的osx主机")
    public void testRetrieveOsxCPUBySnmp() throws Exception {
        CPU cpu = (CPU) snmpSampleService.sampleComponent(osxSnmpVisitor, cpuRelation);
        validate(cpu, true, true);
    }

    @Test
    public void testRetrieveOsxCPUsByBash() throws Exception {
        List<CPU> entries = shellSampleService.sampleComponents(osxBashVisitor, cpusRelation);
        assertTrue(entries.isEmpty());
    }

    @Test
    public void testRetrieveOsxCPUByBash() throws Exception {
        CPU cpu = (CPU) shellSampleService.sampleComponent(osxBashVisitor, cpuRelation);
        validate(cpu, true, false);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsCPUsBySnmp() throws Exception {
        List<CPU> entries = snmpSampleService.sampleComponents(windowsSnmpVisitor, cpusRelation);
        validate(entries, false, true);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsCPUBySnmp() throws Exception {
        CPU cpu = (CPU) snmpSampleService.sampleComponent(windowsSnmpVisitor, cpuRelation);
        validate(cpu, false, true);
    }


    protected void validate(List<CPU> cpus, boolean osx, boolean snmp) {
        assertFalse(cpus.isEmpty());
        for (CPU cpu : cpus) {
            validate(cpu, osx, snmp);
        }
    }

    private void validate(CPU cpu, boolean osx, boolean snmp) {
        System.out.println(ParseUtils.toJSONString(cpu));
        assertNotNull(cpu.getIdx());
        if (!snmp) {
            assertNotNull(cpu.getUsrUsage());
            assertNotNull(cpu.getSysUsage());
            assertNotNull(cpu.getNice());
        }
        assertNotNull(cpu.getIdle());
        assertNotNull(cpu.getUsage());
        if (!osx && !snmp) {
            assertNotNull(cpu.getIoWait());
        }
    }
}