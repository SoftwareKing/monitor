package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.model.GeneralMap;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.snmp4j.smi.OID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@ContextConfiguration(classes = FullSnmpVisitorConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
@Ignore
public class FullSnmpVisitorTest {

    private MibAwareSnmpVisitor visitor;
    @Autowired
    ComponentContext     componentContext;
    @Autowired
    MibScanner           scanner;
    @Autowired
    DefaultMibRepository repository;
    @Autowired
    SnmpVisitorFactory   factory;

    @Before
    public void setUp() throws Exception {
        if (!repository.isRunning()) {
            repository.start();
        }
        if (!scanner.isRunning()) {
            scanner.start();
            scanner.onApplicationEvent(new SystemStartedEvent(componentContext));
        }
        ResourceNode node = new ResourceNode();
        Resource resource = new Resource();
        resource.setAddress("192.168.12.254");
        node.setResource(resource);
        SnmpCredential credential = new SnmpCredential();
        visitor = factory.visitor(node, credential);
    }

    @Test
    public void testTable() throws Exception {
        int ifNumber = (Integer) visitor.get("1.3.6.1.2.1.2.1.0");
        List<GeneralMap<String, Object>> interfaces = new ArrayList<GeneralMap<String, Object>>(ifNumber);
        int offset = 0;
        int pageSize = 100;
        while (offset < ifNumber) {
            OID lower = new OID( String.valueOf(offset));
            OID upper = new OID( String.valueOf(offset + pageSize));
            List<GeneralMap<String, Object>> page = visitor.table("1.3.6.1.2.1.2.2", "if", lower, upper);
            assertTrue(page.size() <= pageSize);
            interfaces.addAll(page);
            offset += page.size();
            if( page.isEmpty() ) break;// means end
        }
        assertEquals(ifNumber, interfaces.size());
    }
}