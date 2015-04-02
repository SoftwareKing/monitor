package dnt.monitor.server.web.controller;

import dnt.monitor.server.model.OperationLog;
import dnt.monitor.server.service.OperationLogService;
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
 * 验证 操作日志 控制层各个方法的正确性
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@ContextConfiguration(classes = OperationLogsControllerConfig.class)
public class OperationLogsControllerTest extends ApplicationControllerTest {

    @Autowired
    private OperationLogService service;

    private List<OperationLog> logs;

    @Before
    public void setUp() throws Exception
    {
        logs = new ArrayList<OperationLog>();
    }

    @Test
    public void testFindPaginationByPath() throws Exception
    {
        expect(service.paginateByPath(anyString(), isA(PageRequest.class))).andReturn(new DefaultPage<OperationLog>(logs));

        // 准备 Mock Request
        MockHttpServletRequestBuilder request = get("/api/operation_logs/default/engine");
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
