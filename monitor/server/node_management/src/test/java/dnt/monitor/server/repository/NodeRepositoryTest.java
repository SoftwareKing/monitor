package dnt.monitor.server.repository;

import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.server.config.NodeRepositoryConfig;
import net.happyonroad.type.Location;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.*;

@ContextConfiguration(classes = NodeRepositoryConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
public class NodeRepositoryTest {
    @Autowired
    NodeRepository repository;
    private GroupNode node;


    @Before
    public void setUp() throws Exception {
        node = new GroupNode();
        node.setPath("/test");
        node.setLocation(new Location(123, 234));
        node.setLabel("测试组");
        node.setIcon("test_icon");
        node.creating();
    }

    @After
    public void tearDown() throws Exception {
        if (node.getId() != null)
            repository.delete(node);
    }

    @Test
    public void testCount() throws Exception {
        long groupCount = repository.count("type = 'Group'");
        assertTrue(groupCount > 0 );
        long all = repository.count(null);
        assertTrue(all > groupCount );
    }

    @Test
    public void testFindByPath() throws Exception {
        ManagedNode root = repository.findByPath("/");
        assertNotNull(root);
        assertEquals("/", root.getPath());
        assertEquals(0, root.getDepth());
    }

    @Test
    public void testFindByResourceId() throws Exception {
        assertNotNull(repository.findByResourceId(1L));
    }

    @Test
    public void testFindByRange() throws Exception {
        assertNotNull(repository.findByRange("192.168.1.0/24"));
    }

    @Test
    public void testFindAllByPathWithLeaf() throws Exception {
        List<ManagedNode> nodes = repository.findAllByPath("/default", 1, 2, true);
        assertEquals(3, nodes.size());
    }

    @Test
    public void testFindAllByPathWithoutLeaf() throws Exception {
        List<ManagedNode> nodes = repository.findAllByPath("/default", 1, 2, false);
        assertEquals(2, nodes.size());
    }

    @Test
    public void testCreate() throws Exception {
        repository.create(node);
        assertNotNull(node.getId());
    }

    @Test
    public void testUpdate() throws Exception {
        repository.create(node);
        node.setIcon("another_icon");
        node.updating();
        repository.update(node);
        ManagedNode newNode = repository.findByPath(node.getPath());
        assertEquals("another_icon", newNode.getIcon());
    }

    @Test
    public void testDelete() throws Exception {
        repository.create(node);
        repository.delete(node);
        ManagedNode found = repository.findByPath(node.getPath());
        assertNull(found);
    }

    @Test
    public void testUpdateNodesPath() throws Exception {
        try {
            repository.updateNodesPath("/engine2/172_16_30_0", "/engine2/172_16_20_0", 0);
            ManagedNode node = repository.findByPath("/engine2/172_16_30_0");
            assertNull(node);
            node = repository.findByPath("/engine2/172_16_20_0");
            assertNotNull(node);
        } finally {
            //reset the data
            repository.updateNodesPath("/engine2/172_16_20_0", "/engine2/172_16_30_0", 0);

        }
    }
}