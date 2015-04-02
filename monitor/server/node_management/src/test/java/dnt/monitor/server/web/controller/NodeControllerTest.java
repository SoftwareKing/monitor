package dnt.monitor.server.web.controller;

import dnt.monitor.model.GroupNode;
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

import java.util.HashMap;
import java.util.Map;

import static org.easymock.EasyMock.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = NodeControllerConfig.class)
public class NodeControllerTest extends ApplicationControllerTest {
    @Autowired
    NodeService  nodeService;
    @Autowired
    EventService eventService;

    GroupNode              root;
    GroupNode              defaultScope;
    ResourceNode           defaultEngine;
    Map<Severity, Integer> defaultEngineSummary;

    ResourceNode responseNode;

    @Before
    public void setUp() throws Exception {
        root = new GroupNode();
        root.setPath("/");

        defaultScope = new GroupNode();
        defaultScope.setPath("/default");
        defaultScope.setLocation(new Location(123, 234));

        defaultEngine = new ResourceNode();
        defaultEngine.setPath("/default/engine");

        defaultEngineSummary = new HashMap<Severity, Integer>();
        defaultEngineSummary.put(Severity.INDETERMINATE, 1);
        defaultEngineSummary.put(Severity.WARNING, 2);
        defaultEngineSummary.put(Severity.MINOR, 3);
        defaultEngineSummary.put(Severity.MAJOR, 4);
        defaultEngineSummary.put(Severity.CRITICAL, 5);
        reset(nodeService);
        reset(eventService);
    }

    @After
    public void tearDown() throws Exception {
        verify(nodeService);
        verify(eventService);
    }

    @Test
    public void testShowDefault() throws Exception {
        expect(nodeService.findByPath("/default/engine")).andReturn(defaultEngine);
        nodeService.merge(defaultEngine, null);
        expectLastCall().andAnswer(new MergeAnswer());
        expect(eventService.summary("/default/engine")).andReturn(defaultEngineSummary);

        MockHttpServletRequestBuilder request = get("/api/node/default/engine");
        decorate(request);

        replayAll();

        ResultActions result = this.browser.perform(request);
        //basic verification
        decorate(result).andExpect(status().isOk());
        result.andDo(new ResultHandler() {
            @Override
            public void handle(MvcResult result) throws Exception {
                responseNode = ParseUtils.parseJson(result.getResponse().getContentAsString(), ResourceNode.class);
            }
        });

        // default behavior verification
        //  1. has event summary
        Assert.assertNotNull(responseNode.getSummary());
        //  2. merge with parent
        Assert.assertNotNull(responseNode.getLocation());
    }

    @Test
    public void testShowWithoutSummary() throws Exception {
        expect(nodeService.findByPath("/default/engine")).andReturn(defaultEngine);
        nodeService.merge(defaultEngine, null);
        expectLastCall().andAnswer(new MergeAnswer());

        MockHttpServletRequestBuilder request = get("/api/node/default/engine?summary=false");
        decorate(request);

        replayAll();

        ResultActions result = this.browser.perform(request);
        //basic verification
        decorate(result).andExpect(status().isOk());
        result.andDo(new ResultHandler() {
            @Override
            public void handle(MvcResult result) throws Exception {
                responseNode = ParseUtils.parseJson(result.getResponse().getContentAsString(), ResourceNode.class);
            }
        });

        // default behavior verification
        //  1. no event summary
        Assert.assertNull(responseNode.getSummary());
        //  2. merge with parent
        Assert.assertNotNull(responseNode.getLocation());
    }

    @Test
    public void testShowWithoutMergeAndSummary() throws Exception {
        expect(nodeService.findByPath("/default/engine")).andReturn(defaultEngine);

        MockHttpServletRequestBuilder request = get("/api/node/default/engine?summary=false&merge=false");
        decorate(request);

        replayAll();

        ResultActions result = this.browser.perform(request);
        //basic verification
        decorate(result).andExpect(status().isOk());
        result.andDo(new ResultHandler() {
            @Override
            public void handle(MvcResult result) throws Exception {
                responseNode = ParseUtils.parseJson(result.getResponse().getContentAsString(), ResourceNode.class);
            }
        });

        // default behavior verification
        //  1. no event summary
        Assert.assertNull(responseNode.getSummary());
        //  2. not merge with parent
        Assert.assertNull(responseNode.getLocation());
    }

    private void replayAll() {
        replay(nodeService);
        replay(eventService);
    }

    private class MergeAnswer implements IAnswer<Void> {
        @Override
        public Void answer() throws Throwable {
            defaultEngine.setLocation(defaultScope.getLocation());
            return null;
        }
    }
}