package dnt.monitor.server.repository;


import dnt.monitor.server.model.MonitorLog;
import net.happyonroad.platform.util.PageRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import java.util.List;

@ContextConfiguration(classes = MonitorLogRepositoryConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class MonitorLogRepositoryTest {
    @Autowired
    MonitorLogRepository repository;

    PageRequest pageRequest;

    @Before
    public void setUp() throws Exception {
        pageRequest = new PageRequest(0, 1);
    }

    @Test
    public void testFindByPath() throws Exception {
        List<MonitorLog> monitorLogs  = repository.findAllByPath("/default/engine",pageRequest);
        System.out.println(monitorLogs);
        Assert.notNull(monitorLogs);
    }
}
