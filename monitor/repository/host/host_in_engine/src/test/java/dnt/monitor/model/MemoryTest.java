package dnt.monitor.model;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

@SuppressWarnings("unchecked")
public class MemoryTest extends HostTestBase {

    MetaRelation memoryRelation;

    @Override
    public void setUp() throws Exception {
        super.setUp();
        MetaResource metaResource = metaService.getMetaResource(Host.class);
        memoryRelation = (MetaRelation) metaResource.getMember("memory");
    }

    @Test
    public void testRetrieveLinuxMemoryBySnmp() throws Exception {
        Memory memory = (Memory) snmpSampleService.sampleComponent(linuxSnmpVisitor, memoryRelation);
        validate(memory, false);
    }

    @Test
    public void testRetrieveLinuxMemoryBySsh() throws Exception {
        Memory memory = (Memory) shellSampleService.sampleComponent(linuxSshVisitor, memoryRelation);
        validate(memory, false);
    }
    @Test
    public void testRetrieveAixMemBySsh() throws Exception {
        Memory memory = (Memory) shellSampleService.sampleComponent(aixSshVisitor, memoryRelation);
        validate( memory,false );
    }
    @Test
    @Ignore("没有公用的osx主机")
    public void testRetrieveOsxMemoryBySnmp() throws Exception {
        Memory memory = (Memory) snmpSampleService.sampleComponent(osxSnmpVisitor, memoryRelation);
        validate(memory, true);
    }

    @Ignore("OSX Memory 采集的命令还没合适的")
    @Test
    public void testRetrieveOsxMemoryByBash() throws Exception {
        Memory memory = (Memory) shellSampleService.sampleComponent(osxBashVisitor, memoryRelation);
        validate(memory, true);
    }

    @Test
    @Ignore("没有公用的windows主机")
    public void testRetrieveWindowsMemoryBySnmp() throws Exception {
        Memory memory = (Memory) snmpSampleService.sampleComponent(windowsSnmpVisitor, memoryRelation);
        validate(memory, true);
    }


    private void validate(Memory memory, boolean osx) {
        System.out.println(ParseUtils.toJSONString(memory));

        assertNotNull(memory.getTotal());
        assertNotNull(memory.getUsed());
        assertNotNull(memory.getFree());
        assertNotNull(memory.getUsage());

        assertNotNull(memory.getVirtualTotal());
        assertNotNull(memory.getVirtualUsed());
        assertNotNull(memory.getVirtualFree());
        assertNotNull(memory.getVirtualUsage());

    }
}