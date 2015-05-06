package dnt.monitor.server.support;

import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.*;
import dnt.monitor.server.repository.NodeRepository;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.server.service.ResourceService;
import dnt.monitor.server.service.ServiceLocator;
import dnt.monitor.service.MetaService;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.type.Location;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.easymock.EasyMock.*;
import static org.junit.Assert.*;

@ContextConfiguration(classes = NodeManagerConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class NodeManagerTest {
    @Autowired
    NodeService    nodeService;
    @Autowired
    NodeRepository nodeRepository;
    @Autowired
    ServiceLocator serviceLocator;
    @Autowired
    ComponentContext context;
    @Autowired
    MetaService metaService;

    GroupNode root;
    GroupNode defaultScope;
    ResourceNode defaultEngine;
    ResourceNode defaultHost;

    @Before
    public void setUp() throws Exception {
        root = new GroupNode();
        root.setPath("/");

        defaultScope = new GroupNode();
        defaultScope.setPath("/default");
        defaultScope.setLabel("Default Scope");
        defaultScope.setLocation(new Location(123, 234));

        defaultEngine = new ResourceNode();
        defaultEngine.setPath("/default/engine");
        defaultEngine.setLabel("Default Engine");
        defaultEngine.setResource(new MonitorEngine());

        defaultHost = new ResourceNode();
        defaultHost.setPath("/default/host");
        defaultHost.setLabel("Default Host");
        defaultHost.setResource(new Host());
        defaultHost.getResource().setType("/device/host");


        reset(nodeRepository);
        reset(serviceLocator);
        reset(context);
        reset(metaService);
    }

    @Test
    public void testMergeRoot() throws Exception {
        //verify merge the root
        try {
            nodeService.merge(root, null);
            fail("it should raise IllegalArgumentException");
        } catch (Exception e) {
            assertTrue(e.getMessage().contains("shouldn't merge root node"));
        }
        //verify merge node with parent,
        nodeService.merge(defaultScope, root);
    }

    @Test
    public void testMergeChildWithEmptyParent() throws Exception {
        //verify merge node with parent
        nodeService.merge(defaultScope, root);
        assertNotNull(defaultScope.getLocation());
    }

    @Test
    public void testMergeChildEmptyWithParent() throws Exception {
        //verify merge node with parent
        nodeService.merge(defaultEngine, defaultScope);
        assertNotNull(defaultEngine.getLocation());
    }

    @Test
    public void testMergeChildWithNull() throws Exception {
        //verify merge node with parent
        expect(nodeRepository.findByPath(defaultScope.getPath())).andReturn(defaultScope);

        replay(nodeRepository);

        nodeService.merge(defaultEngine, null);
        assertNotNull(defaultEngine.getLocation());

        verify(nodeRepository);

    }

    @Test
    public void testCreate() throws Exception {

        ResourceNode newResource = new ResourceNode();
        newResource.setProperty(Resource.PROPERTY_RELATIVE_PATH, "newResource");
        newResource.setResource(new Resource());

        //noinspection unchecked
        expect(context.getApplicationFeatures()).andStubReturn(new ArrayList<ApplicationContext>());

        nodeRepository.create(newResource);
        expectLastCall().once();
        nodeRepository.increaseNodeResourceSize("/default", 1);
        expectLastCall().once();

        replay(nodeRepository);
        replay(context);

        nodeService.create(defaultScope, newResource);
        assertEquals("/default/newResource", newResource.getPath());

        verify(nodeRepository);
        verify(context);
    }

    @Test
    public void testUpdatePath() throws Exception {
        ManagedNode newEngine = new ManagedNode();
        newEngine.apply(defaultEngine);
        newEngine.setPath("/default/new_name");

        try {
            nodeService.update(defaultEngine, newEngine);
            fail("It should raise illegal argument exception");
        } catch (Exception e) {
            assertTrue(e.getMessage().contains("Can't change the node path"));
        }
    }

    @Test
    public void testUpdate() throws Exception {
        ResourceNode newEngine = new ResourceNode();
        newEngine.apply(defaultEngine);
        newEngine.setComment("changed engine");
        expect(nodeRepository.update(anyObject(ManagedNode.class))).andReturn(1);
        //noinspection unchecked
        expect(context.getApplicationFeatures()).andStubReturn(new ArrayList<ApplicationContext>());

        replay(nodeRepository);
        replay(context);

        ManagedNode updated = nodeService.update(defaultEngine, newEngine);

        assertEquals("changed engine", updated.getComment());

        verify(nodeRepository);
        verify(context);
    }

    @Test
    public void testDeleteNotEmptyNode() throws Exception {
        List<ManagedNode> nodes = new ArrayList<ManagedNode>();
        nodes.add(defaultEngine);
        expect(nodeRepository.findAllByPath(defaultScope.getPath(), 1, 2, true)).andReturn(nodes);
        expect(metaService.getMetaResource(anyString())).andStubReturn(new MetaResource(Resource.class));

        ResourceService mockEngineService = createMock(ResourceService.class);
        expect(serviceLocator.locate(defaultEngine.getResource().getType())).andStubReturn(mockEngineService);
        expect(mockEngineService.findById(anyLong())).andReturn(defaultEngine.getResource()).anyTimes();

        replay(nodeRepository);
        replay(serviceLocator);
        replay(metaService);
        replay(mockEngineService);

        try {
            nodeService.delete(defaultScope);
            fail("It should raise illegal argument exception for node with children");
        } catch (Exception e) {
            assertTrue(e.getMessage().contains("Can't delete node with children"));
        }

        verify(nodeRepository);
        verify(serviceLocator);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testDeleteLeafNode() throws Exception {
        expect(context.getApplicationFeatures()).andStubReturn(new ArrayList<ApplicationContext>());
        nodeRepository.delete(defaultEngine);
        expectLastCall().once();
        nodeRepository.increaseNodeResourceSize("/default", -1);
        expectLastCall().once();

        replay(nodeRepository);
        replay(serviceLocator);
        replay(context);

        nodeService.delete(defaultEngine);

        verify(nodeRepository);
        verify(serviceLocator);
        verify(context);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testDeleteHierarchy() throws Exception {
        List<ManagedNode> nodes = new ArrayList<ManagedNode>();
        nodes.add(defaultEngine);
        nodes.add(defaultHost);
        expect(nodeRepository.findAllByPath(defaultScope.getPath(), 1, 1001, true)).andReturn(nodes);

        expect(context.getApplicationFeatures()).andStubReturn(new ArrayList<ApplicationContext>());
        expect(metaService.getMetaResource(anyString())).andStubReturn(new MetaResource(Resource.class));

        ResourceService mockEngineService = createMock(ResourceService.class);
        expect(serviceLocator.locate(defaultEngine.getResource().getType())).andStubReturn(
                mockEngineService);
        expect(mockEngineService.findById(anyLong())).andReturn(defaultEngine.getResource()).anyTimes();

        ResourceService mockHostService = createMock(ResourceService.class);
        expect(serviceLocator.locate(defaultHost.getResource().getType())).andStubReturn(mockHostService);
        expect(mockHostService.findById(anyLong())).andReturn(defaultHost.getResource()).anyTimes();

        nodeRepository.delete(defaultHost);
        expectLastCall().once();
        nodeRepository.delete(defaultEngine);
        expectLastCall().once();
        nodeRepository.delete(defaultScope);
        expectLastCall().once();
        nodeRepository.increaseNodeResourceSize("/default", -1);
        expectLastCall().times(2);
        nodeRepository.increaseNodeGroupSize("/default", -1);
        expectLastCall().anyTimes();
        expect(nodeRepository.findAllByPath(defaultScope.getPath(), 1, 2, true)).andReturn(new ArrayList<ManagedNode>());
        nodeRepository.increaseNodeGroupSize("/", -1);
        expectLastCall().anyTimes();

        replay(nodeRepository);
        replay(serviceLocator);
        replay(context);
        replay(metaService);
        replay(mockEngineService);
        replay(mockHostService);

        nodeService.deleteHierarchy(defaultScope);

        verify(nodeRepository);
        verify(serviceLocator);
        verify(context);
    }

    @Test
    public void testSort() throws Exception {
        NodeManager manager = (NodeManager) nodeService;
        List<ManagedNode> nodes = new ArrayList<ManagedNode>();
        nodes.add(root);
        nodes.add(defaultHost);
        nodes.add(defaultEngine);
        nodes.add(defaultScope);
        manager.sort(nodes);
        assertSame(defaultHost, nodes.get(0));
        assertSame(defaultEngine, nodes.get(1));
        assertSame(defaultScope, nodes.get(2));
        assertSame(root, nodes.get(3));
    }
}