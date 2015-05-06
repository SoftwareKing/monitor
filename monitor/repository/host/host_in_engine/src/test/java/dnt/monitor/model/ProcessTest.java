package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

@SuppressWarnings("unchecked")
public class ProcessTest extends HostTestBase {

    MetaRelation processesRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Host.class);
        processesRelation = (MetaRelation) metaResource.getMember("processes");
    }

    @Test
    public void testRetrieveLinuxProcessesBySnmp() throws Exception {
        List<Process> entries = snmpSampleService.sampleComponents(linuxSnmpVisitor, processesRelation);
        validate(entries, false, true);
    }

    @Test
    public void testRetrieveLinuxProcessesBySsh() throws Exception {
        List<Process> entries = shellSampleService.sampleComponents(linuxSshVisitor, processesRelation);
        validate(entries, false, false);
    }

    @Test
    public void testRetrieveAixProcessesBySsh() throws Exception {
        List<Process> entries = shellSampleService.sampleComponents(aixSshVisitor, processesRelation);
        validate(entries, true, false);
    }

    @Test
    @Ignore("暂时没找到通过SNMP采集主机 Process 等硬件的mib库")
    public void testRetrieveOsxProcessesBySnmp() throws Exception {
        List<Process> entries = snmpSampleService.sampleComponents(osxSnmpVisitor, processesRelation);
        validate(entries, false, true);
    }

    @Test
    public void testRetrieveOsxProcessesByBash() throws Exception {
        List<Process> entries = shellSampleService.sampleComponents(osxBashVisitor, processesRelation);
        validate(entries, true, false);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsProcessesBySnmp() throws Exception {
        List<Process> entries = snmpSampleService.sampleComponents(windowsSnmpVisitor, processesRelation);
        validate(entries, false, true);
    }


    protected void validate(List<Process> processes, boolean osx, boolean snmp) {
        assertFalse(processes.isEmpty());
        for (Process process : processes) {
            validate(process, osx, snmp);
        }
    }

    private void validate(Process process, boolean osx, boolean snmp) {
        System.out.println(ParseUtils.toJSONString(process));
        assertNotNull(process.getPid());
        assertNotNull(process.getStatus());
        assertNotNull(process.getCommand());
        if (!snmp) {
            assertNotNull(process.getUser());
            assertNotNull(process.getPpid());
            assertNotNull(process.getStartTime());
            assertNotNull(process.getTime());
            assertNotNull(process.getPhysicalMemory());
            assertNotNull(process.getVirtualMemory());
            assertNotNull(process.getCpuUsage());
        }
        if (!osx) {
            assertNotNull(process.getLabel());
        }
    }
}