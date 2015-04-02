package dnt.monitor.server.support;

import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.service.TopoService;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = TopoManagerConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
@Ignore("Conflict with TopoRepositoryTest, the db is reset by System Shutdown Hook, " +
        "we should change that mechanism, reset by every suite")
public class TopoManagerTest {
    @Autowired
    TopoService topoService;

    @Test
    public void testFindMapByPath() throws Exception {
        TopoMap map = topoService.findMapByPath("/infrastructure");
        assertNotNull(map);
        assertFalse(map.getNodes().isEmpty());
        assertFalse(map.getLinks().isEmpty());

        //验证 node/link 已经被服务层正确组装
        TopoNode node = map.getNodes().iterator().next();
        assertNotNull(node.getMap());

        TopoLink link = map.getLinks().iterator().next();
        assertNotNull(link.getMap());
        assertNotNull(link.getFromNode());
        assertNotNull(link.getToNode());

    }
}