package dnt.monitor.server.web.controller;

import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.service.EventService;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.test.controller.ApplicationControllerTest;
import net.happyonroad.type.Location;
import net.happyonroad.type.Severity;
import net.happyonroad.util.ParseUtils;
import org.easymock.IAnswer;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultHandler;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.easymock.EasyMock.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = NodeControllerConfig.class)
public class NodesControllerTest extends ApplicationControllerTest {
    @Autowired
    NodeService  nodeService;
    @Autowired
    EventService eventService;

    GroupNode              root;
    GroupNode              defaultScope;
    ResourceNode           defaultEngine;
    GroupNode              secondScope;
    ResourceNode           secondEngine;
    Map<Severity, Integer> allSummary;
    Map<Severity, Integer> defaultEngineSummary;
    Map<Severity, Integer> secondEngineSummary;

    ManagedNode[] responseNodes;

    @Before
    public void setUp() throws Exception {
        root = new GroupNode();
        root.setPath("/");

        defaultScope = new GroupNode();
        defaultScope.setPath("/default");
        defaultScope.setLocation(new Location(123, 234));
        defaultEngine = new ResourceNode();
        defaultEngine.setPath("/default/engine");
        defaultEngine.setResource(new MonitorEngine());

        secondScope = new GroupNode();
        secondScope.setPath("/second");
        secondScope.setLocation(new Location(100, 300));
        secondEngine = new ResourceNode();
        secondEngine.setPath("/second/engine");
        secondEngine.setResource(new MonitorEngine());

        defaultEngineSummary = new HashMap<Severity, Integer>();
        defaultEngineSummary.put(Severity.INDETERMINATE, 1);
        defaultEngineSummary.put(Severity.WARNING, 2);
        defaultEngineSummary.put(Severity.MINOR, 3);
        defaultEngineSummary.put(Severity.MAJOR, 4);
        defaultEngineSummary.put(Severity.CRITICAL, 5);

        secondEngineSummary = new HashMap<Severity, Integer>();
        secondEngineSummary.put(Severity.INDETERMINATE, 0);
        secondEngineSummary.put(Severity.WARNING, 21);
        secondEngineSummary.put(Severity.MINOR, 33);
        secondEngineSummary.put(Severity.MAJOR, 44);
        secondEngineSummary.put(Severity.CRITICAL, 55);

        allSummary = new HashMap<Severity, Integer>();
        allSummary.put(Severity.INDETERMINATE, 1);
        allSummary.put(Severity.WARNING, 23);
        allSummary.put(Severity.MINOR, 36);
        allSummary.put(Severity.MAJOR, 48);
        allSummary.put(Severity.CRITICAL, 60);

        reset(nodeService);
        reset(eventService);
    }

    @After
    public void tearDown() throws Exception {
        try {
            verify(nodeService);
            verify(eventService);
        } catch (IllegalStateException e) {
            if (e.getMessage().contains("calling verify is not allowed in record state"))
                System.err.println("Failed to replay mocks, check your test cases");
            else throw e;
        }
    }

    // summary = true
    // merge = true
    // depth = 1
    // expand = true
    // leaf = true
    @Test
    public void testIndexDefault() throws Exception {
        expect(nodeService.findByPath("/")).andReturn(root);
        List<ManagedNode> nodes = new ArrayList<ManagedNode>();
        nodes.add(defaultScope);
        nodes.add(secondScope);
        expect(nodeService.findSubNodes(root, 1, true)).andReturn(nodes);

        nodeService.merge(eq(defaultScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(defaultScope, root));
        nodeService.merge(eq(secondScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(secondScope, root));

        expect(eventService.summary("/default")).andReturn(defaultEngineSummary);
        expect(eventService.summary("/second")).andReturn(secondEngineSummary);

        MockHttpServletRequestBuilder request = get("/api/nodes");
        decorate(request);

        replayAll();

        ResultActions result = this.browser.perform(request);
        //basic verification
        decorate(result).andExpect(status().isOk());

        result.andDo(new ResultHandler() {
            @Override
            public void handle(MvcResult result) throws Exception {
                responseNodes = ParseUtils.parseJson(result.getResponse().getContentAsString(), ManagedNode[].class);
            }
        });
        Assert.assertEquals(2, responseNodes.length);
        // default behavior verification
        //  1. has event summary
        Assert.assertNotNull(responseNodes[0].getSummary());

    }

    // summary = true
    // merge = true
    // depth = 1
    // expand = true
    // leaf = false
    @Test
    public void testIndexWithoutLeaf() throws Exception {
        expect(nodeService.findByPath("/")).andReturn(root);
        List<ManagedNode> nodes = new ArrayList<ManagedNode>();
        nodes.add(defaultScope);
        nodes.add(secondScope);
        expect(nodeService.findSubNodes(root, 1, false)).andReturn(nodes);

        nodeService.merge(eq(defaultScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(defaultScope, root));
        nodeService.merge(eq(secondScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(secondScope, root));

        expect(eventService.summary("/default")).andReturn(defaultEngineSummary);
        expect(eventService.summary("/second")).andReturn(secondEngineSummary);

        MockHttpServletRequestBuilder request = get("/api/nodes?leaf=false");
        decorate(request);

        replayAll();

        ResultActions result = this.browser.perform(request);
        //basic verification
        decorate(result).andExpect(status().isOk());

        result.andDo(new ResultHandler() {
            @Override
            public void handle(MvcResult result) throws Exception {
                responseNodes = ParseUtils.parseJson(result.getResponse().getContentAsString(), ManagedNode[].class);
            }
        });
        Assert.assertEquals(2, responseNodes.length);
        // default behavior verification
        //  1. has event summary
        Assert.assertNotNull(responseNodes[0].getSummary());

    }

    // summary = true
    // merge = true
    // depth = 2
    // expand = true
    // leaf = true
    @Test
    public void testIndexDepthAsTwo() throws Exception{
        expect(nodeService.findByPath("/")).andReturn(root);
        List<ManagedNode> nodes = new ArrayList<ManagedNode>();
        nodes.add(defaultScope);
        nodes.add(secondScope);
        nodes.add(defaultEngine);
        nodes.add(secondEngine);
        expect(nodeService.findSubNodes(root, 2, true)).andReturn(nodes);

        nodeService.merge(eq(defaultScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(defaultScope, root));
        nodeService.merge(eq(secondScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(secondScope, root));
        nodeService.merge(eq(defaultEngine), eq(defaultScope));
        expectLastCall().andAnswer(new MergeAnswer(defaultEngine, defaultScope));
        nodeService.merge(eq(secondEngine), eq(secondScope));
        expectLastCall().andAnswer(new MergeAnswer(secondEngine, secondScope));

        expect(eventService.summary("/default")).andReturn(defaultEngineSummary);
        expect(eventService.summary("/second")).andReturn(secondEngineSummary);
        expect(eventService.summary("/default/engine")).andReturn(defaultEngineSummary);
        expect(eventService.summary("/second/engine")).andReturn(secondEngineSummary);

        MockHttpServletRequestBuilder request = get("/api/nodes?depth=2");
        decorate(request);

        replayAll();

        ResultActions result = this.browser.perform(request);
        //basic verification
        decorate(result).andExpect(status().isOk());
        result.andDo(new ResultHandler() {
            @Override
            public void handle(MvcResult result) throws Exception {
                responseNodes = ParseUtils.parseJson(result.getResponse().getContentAsString(), ManagedNode[].class);
            }
        });
        // 1. two depth
        Assert.assertEquals(4, responseNodes.length);
        // 2. has event summary
        Assert.assertNotNull(responseNodes[0].getSummary());
        // 3. merged
        Assert.assertNotNull(responseNodes[3].getLocation());

    }

    // summary = true
    // merge = true
    // depth = 2
    // expand = false
    // leaf = true
    @Test
    public void testIndexDepthAsTwoAndNotExpand() throws Exception{
        expect(nodeService.findByPath("/")).andReturn(root);
        List<ManagedNode> nodes = new ArrayList<ManagedNode>();
        nodes.add(defaultScope);
        nodes.add(secondScope);
        nodes.add(defaultEngine);
        nodes.add(secondEngine);
        expect(nodeService.findSubNodes(root, 2, true)).andReturn(nodes);

        nodeService.merge(eq(defaultScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(defaultScope, root));
        nodeService.merge(eq(secondScope), eq(root));
        expectLastCall().andAnswer(new MergeAnswer(secondScope, root));
        nodeService.merge(eq(defaultEngine), eq(defaultScope));
        expectLastCall().andAnswer(new MergeAnswer(defaultEngine, defaultScope));
        nodeService.merge(eq(secondEngine), eq(secondScope));
        expectLastCall().andAnswer(new MergeAnswer(secondEngine, secondScope));

        expect(eventService.summary("/default")).andReturn(defaultEngineSummary);
        expect(eventService.summary("/second")).andReturn(secondEngineSummary);
        expect(eventService.summary("/default/engine")).andReturn(defaultEngineSummary);
        expect(eventService.summary("/second/engine")).andReturn(secondEngineSummary);

        MockHttpServletRequestBuilder request = get("/api/nodes?depth=2&expand=false");
        decorate(request);

        replayAll();

        ResultActions result = this.browser.perform(request);
        //basic verification
        decorate(result).andExpect(status().isOk());
        result.andDo(new ResultHandler() {
            @Override
            public void handle(MvcResult result) throws Exception {
                responseNodes = ParseUtils.parseJson(result.getResponse().getContentAsString(), ManagedNode[].class);
            }
        });
        // 1. two depth, but not expanded
        Assert.assertEquals(2, responseNodes.length);
        GroupNode groupNode = (GroupNode) responseNodes[0];
        // 2. not expanded (has children)
        Assert.assertNotNull(groupNode.getChildren()) ;
        // 3. has event summary
        Assert.assertNotNull(groupNode.getSummary());
        // 4. merged
        Assert.assertNotNull(groupNode.getChildren().get(0).getLocation());

    }

    private void replayAll() {
        replay(nodeService);
        replay(eventService);
    }

    private class MergeAnswer implements IAnswer<Void> {

        private final ManagedNode node;
        private final ManagedNode parent;

        public MergeAnswer(ManagedNode node, ManagedNode parent) {
            this.node = node;
            this.parent = parent;
        }

        @Override
        public Void answer() throws Throwable {
            if( node.getLocation() == null )
                node.setLocation(parent.getLocation());
            return null;
        }
    }
}