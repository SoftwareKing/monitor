package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.snmp.SnmpVisitor;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.model.GeneralMap;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

@ContextConfiguration(classes = FullSnmpVisitorConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
//@Ignore
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
    public void testIfTable() throws Exception {
        int ifNumber = (Integer) visitor.get("1.3.6.1.2.1.2.1.0");
        List<GeneralMap<String, Object>> interfaces = visitor.table(1000 * 60 * 5, "1.3.6.1.2.1.2.2", "if");
        assertEquals(ifNumber, interfaces.size());
    }

    @Test
    public void testRouteTable() throws Exception {
        visitor.setOption(SnmpVisitor.MAX_COLS_PER_PDU, 500);
        visitor.setOption(SnmpVisitor.MAX_ROWS_PER_PDU, 1000);
        List<GeneralMap<String, Object>> routes = visitor.table(1000 * 60 * 5, "1.3.6.1.2.1.4.21", "ipRoute");
        assertFalse(routes.isEmpty());
    }
}