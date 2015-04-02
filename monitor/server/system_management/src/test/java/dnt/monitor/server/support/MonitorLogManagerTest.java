package dnt.monitor.server.support;

import dnt.monitor.server.model.MonitorLog;
import dnt.monitor.server.service.MonitorLogService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.util.PageRequest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


@ContextConfiguration(classes = MonitorLogManagerConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class MonitorLogManagerTest {
    @Autowired
    MonitorLogService monitorLogService;

    PageRequest pageRequest;

    @Before
    public void setUp() throws Exception {
        pageRequest = new PageRequest(0, 1);
    }

    @Test
    public void testFindAllByPath() throws Exception {
        Page<MonitorLog> logs = monitorLogService.paginateByPath("/default/engine", pageRequest);
        Assert.assertNotNull(logs.getTotalElements());
        Assert.assertNotNull(logs.getNumberOfElements());
        Assert.assertTrue(logs.getContent().size()>0);
    }
}
