package dnt.monitor.server.repository;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@ContextConfiguration(classes = TopoRepositoryConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
public class TopoRepositoryTest {
    @Autowired
    TopoRepository repository;

    @Test
    public void testFindMapById() throws Exception {
        TopoMap map = repository.findMapById(2L);
        validateFullMap(map);
    }

    @Test
    public void testFindMapByPath() throws Exception {
        TopoMap map = repository.findMapByPath("/infrastructure");
        validateFullMap(map);
    }

    void validateFullMap(TopoMap map) {
        assertNotNull(map);

        assertNotNull(map.getNodes());
        assertFalse(map.getNodes().isEmpty());
        TopoNode node = map.getNodes().iterator().next();
        // 两级查询策略：第三级只有FK,没有对象
        assertNotNull(node.getPath());
        assertNull(node.getNode());

        assertNotNull(map.getLinks());
        assertFalse(map.getLinks().isEmpty());
        TopoLink link = map.getLinks().iterator().next();
        // 两级查询策略：第三级只有FK,没有对象
        assertNotNull(link.getFromId());
        assertNotNull(link.getToId());
        assertNull(link.getFromNode());
        assertNull(link.getToNode());

        assertNotNull(map.getNode());
    }

    @Test
    public void testFindNodeByPath() throws Exception {
        TopoNode node = repository.findNodeByPath("/default");
        validateNode(node);
    }

    @Test
    public void testFindNodeById() throws Exception {
        TopoNode node = repository.findNodeById(2L);
        validateNode(node);
    }

    @Test
    public void testFindNodeByResourceId() throws Exception {
        TopoNode node = repository.findNodeByResourceId(1L);
        validateNode(node);
    }

    void validateNode(TopoNode topoNode) {
        assertNotNull(topoNode);
        assertNotNull(topoNode.getMapId());
        assertNotNull(topoNode.getMap());
        assertNotNull(topoNode.getNode());
    }

    @Test
    public void testFindLinkById() throws Exception {
        TopoLink link = repository.findLinkById(1L);
        validateLink(link);
    }

    @Test
    public void testFindLinkByUnderlyingId() throws Exception {
        TopoLink topoLink = repository.findLinkByUnderlyingId(1L);
        validateLink(topoLink);
    }

    void validateLink(TopoLink link) {
        assertNotNull(link);
        assertNotNull(link.getMapId());
        assertNotNull(link.getMap());
        assertNotNull(link.getFromId());
        assertNotNull(link.getFromNode());
        assertNotNull(link.getToId());
        assertNotNull(link.getToNode());
    }

    @Test
    public void testCreateMap() throws Exception {
        ManagedNode node = new ManagedNode();
        node.setLabel("Test Map");
        node.setPath("/test_map");
        TopoMap map = new TopoMap();
        map.setLabel("Test Map");
        map.setNode(node);
        map.setPath(node.getPath());
        map.setScale(1.0f);
        repository.createMap(map);
        assertNotNull(map.getId());

        TopoMap found = repository.findMapByPath(node.getPath());
        assertNotNull(found);
    }

    @Test
    public void testCreateNode() throws Exception {
        TopoMap map = repository.findMapByPath("/");
        ManagedNode node = new ManagedNode();
        node.setPath("/test_node");
        node.setLabel("Test Node");
        TopoNode topoNode = new TopoNode();
        topoNode.setMap(map);
        topoNode.setNode(node);
        topoNode.setPath(node.getPath());
        topoNode.setLabel(node.getLabel());
        topoNode.setIcon(node.getIcon());
        repository.createNode(topoNode);
        assertNotNull(topoNode.getId());

        map = repository.findMapByPath("/");
        assertNotNull(map);
        assertTrue(map.getNodes().contains(topoNode));
    }

    @Test
    public void testCreateLink() throws Exception {
        TopoLink topoLink = new TopoLink();
        TopoMap map = repository.findMapByPath("/default");
        TopoNode fromNode = repository.findNodeByPath("/default/group1");
        TopoNode toNode = repository.findNodeByPath("/default/range1");
        topoLink.setMap(map);
        topoLink.setFromNode(fromNode);
        topoLink.setToNode(toNode);
        topoLink.setLabel("A test link");
        topoLink.setType("ELBOW");
        repository.createLink(topoLink);
        assertNotNull(topoLink.getId());
    }

    @Test
    public void testUpdateMap() throws Exception {
        TopoMap map = repository.findMapByPath("/default");
        map.setProperty("test", "property");
        repository.updateMap(map);
        TopoMap newMap = repository.findMapByPath(map.getPath());
        assertEquals("property", newMap.getProperty("test"));
    }

    @Test
    public void testUpdateNode() throws Exception {
        TopoNode node = repository.findNodeByPath("/default");
        node.setProperty("test", "property");
        repository.updateNode(node);
        TopoNode newNode = repository.findNodeByPath(node.getPath());
        assertEquals("property", newNode.getProperty("test"));
    }

    @Test
    public void testUpdateLink() throws Exception {
        TopoLink link = repository.findLinkById(1L);
        link.setProperty("test", "property");
        repository.updateLink(link);
        TopoLink newLink = repository.findLinkById(link.getId());
        assertEquals("property", newLink.getProperty("test"));
    }

    @Test
    public void testUpdateMapsPath() throws Exception {
        try {
            repository.updateMapsPath("/engine2/172_16_30_0", "/engine2/172_16_20_0");
            TopoMap map = repository.findMapByPath("/engine2/172_16_30_0");
            assertNull(map);
            map = repository.findMapByPath("/engine2/172_16_20_0");
            assertNotNull(map);
        } finally {
            //reset the data
            repository.updateMapsPath("/engine2/172_16_20_0", "/engine2/172_16_30_0");
        }
    }

    @Test
    public void testUpdateNodesPath() throws Exception {
        try {
            repository.updateNodesPath("/engine2/172_16_30_0", "/engine2/172_16_20_0");
            TopoNode node = repository.findNodeByPath("/engine2/172_16_30_0");
            assertNull(node);
            node = repository.findNodeByPath("/engine2/172_16_20_0");
            assertNotNull(node);
        } finally {
            //reset the data
            repository.updateNodesPath("/engine2/172_16_20_0", "/engine2/172_16_30_0");
        }

    }

    @Test
    public void testDeleteNode() throws Exception {
        String target = "/engine2/172_16_30_0/172_16_30_10";
        repository.deleteNode(target);
        TopoMap map = repository.findMapByPath("/engine2");
        boolean found = false;
        for(TopoNode node : map.getNodes()){
            if( node.getPath().equals(target) )
                found = true;
        }
        assertFalse(found);
    }

    @Test
    public void testDeleteMap() throws Exception {
        repository.deleteMap("/default/range1");
    }

    @Test
    public void testDeleteLink() throws Exception {
        repository.deleteLink(10L);
    }
}