package dnt.monitor.server.support;

import dnt.monitor.server.model.Event;
import dnt.monitor.server.service.EventService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.util.PageRequest;
import net.happyonroad.type.Severity;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Map;

/**
 * 验证事件管理业务层各个方法的正确性
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@ContextConfiguration(classes = EventManagerConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class EventManagerTest
{
    @Autowired
    private EventService service;

    private PageRequest pageRequest;

    @Before
    public void setUp() throws Exception {
        pageRequest = new PageRequest(0, 1);
    }

    @Test
    public void testSummary() throws Exception
    {
        String path = null;
        Map<Severity, Integer> summary = service.summary(path);
        Assert.assertFalse(summary.isEmpty());
        path = "/not/exist";
        summary = service.summary(path);
        Assert.assertTrue(summary != null);
        Assert.assertTrue(summary.isEmpty());
        path = "/default/engine";
        summary = service.summary(path);
        Assert.assertFalse(summary.isEmpty());
        for(Severity key : summary.keySet())
        {
            System.err.println(key.name() + " : " + key.getValue());
        }
    }

    @Test
    public void testFindPaginationByPath() throws Exception
    {
        String path = null;
        Page<Event> events = service.paginateByPath(path, pageRequest);
        Assert.assertTrue(events.getTotalElements() != 0);
        Assert.assertTrue(events.getTotalPages() != 0);
        Assert.assertTrue(events.hasContent());
        path = "/not/exist";
        events = service.paginateByPath(path, pageRequest);
        Assert.assertTrue(events != null);
        Assert.assertTrue(events.getTotalElements() == 0);
        Assert.assertTrue(events.getTotalPages() == 0);
        Assert.assertFalse(events.hasContent());
        path = "/default/engine";
        events = service.paginateByPath(path, pageRequest);
        Assert.assertTrue(events.getTotalElements() != 0);
        Assert.assertTrue(events.getTotalPages() != 0);
        Assert.assertTrue(events.hasContent());
    }
}
