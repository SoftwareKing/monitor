package dnt.monitor.server.web.controller;

import dnt.monitor.server.model.Event;
import dnt.monitor.server.service.EventService;
import net.happyonroad.platform.util.DefaultPage;
import net.happyonroad.platform.util.PageRequest;
import net.happyonroad.test.controller.ApplicationControllerTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.ArrayList;
import java.util.List;

import static org.easymock.EasyMock.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 验证事件管理控制层各个方法的正确性
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@ContextConfiguration(classes = EventsControllerConfig.class)
public class EventsControllerTest extends ApplicationControllerTest {

    @Autowired
    private EventService service;

    private List<Event> events;

    @Before
    public void setUp() throws Exception
    {
        events = new ArrayList<Event>();
    }

    @Test
    public void testFindPaginationByPath() throws Exception
    {
        expect(service.paginateByPath(anyString(), isA(PageRequest.class))).andReturn(new DefaultPage<Event>(events));

        // 准备 Mock Request
        MockHttpServletRequestBuilder request = get("/api/events/default/engine");
        request = decorate(request);
        replay(service);

        // 执行
        ResultActions result = this.browser.perform(request);

        // 对业务结果的验证
        decorate(result).andExpect(status().isOk());
    }

    @After
    public void tearDown() throws Exception {
        verify(service);
    }
}
