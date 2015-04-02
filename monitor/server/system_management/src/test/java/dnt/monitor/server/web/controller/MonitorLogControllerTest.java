package dnt.monitor.server.web.controller;

import dnt.monitor.server.model.MonitorLog;
import dnt.monitor.server.service.MonitorLogService;
import net.happyonroad.platform.util.DefaultPage;
import net.happyonroad.platform.util.PageRequest;
import net.happyonroad.test.controller.ApplicationControllerTest;
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

@ContextConfiguration(classes = MonitorLogControllerConfig.class)
public class MonitorLogControllerTest extends ApplicationControllerTest {

    @Autowired
    MonitorLogService monitorLogService;

    MonitorLog monitorLog;
    List<MonitorLog> monitorLogs;

    @Before
    public void setUp() throws Exception {
        monitorLog = new MonitorLog();
        monitorLog.setPath("/default");
        monitorLog.setContent("abcd");
        monitorLogs = new ArrayList<MonitorLog>();
        monitorLogs.add(monitorLog);
    }

    @Test
    public void testFindByPath() throws Exception {

        expect(monitorLogService.paginateByPath(anyString(), isA(PageRequest.class))).andReturn(new DefaultPage<MonitorLog>(monitorLogs));

        // 准备 Mock Request
        MockHttpServletRequestBuilder request = get("/api/monitor_logs/default/engine");
        request = decorate(request);

        replay(monitorLogService);

        // 执行
        ResultActions result = this.browser.perform(request);

        // 对业务结果的验证
        decorate(result).andExpect(status().isOk());



    }
}
