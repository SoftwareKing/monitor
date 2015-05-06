package dnt.monitor.server.repository;

import dnt.monitor.server.config.EventRepositoryConfig;
import dnt.monitor.server.model.Event;
import net.happyonroad.platform.util.PageRequest;
import net.happyonroad.type.AckStatus;
import net.happyonroad.type.Priority;
import net.happyonroad.type.Severity;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

/**
 * 验证事件数据访问层各个方法的正确性
 */

@ContextConfiguration(classes = EventRepositoryConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class EventRepositoryTest
{
    @Autowired
    private EventRepository repository;

    private PageRequest pageRequest;

    @Before
    public void setUp() throws Exception {
        pageRequest = new PageRequest(0, 1);
    }

    @Test
    public void testSummary()
    {
        String path = null;
        List<Map<String, Object>> items = repository.summary(path);
        Assert.assertFalse(items.isEmpty());
        path = "/not/exist";
        items = repository.summary(path);
        Assert.assertTrue(items != null);
        Assert.assertTrue(items.isEmpty());
        path = "/default";
        items = repository.summary(path);
        Assert.assertFalse(items.isEmpty());
        System.err.println(items);
    }

    @Test
    public void testFindPaginationByPath()
    {
        String path = null;
        long count = repository.countByPath(path);
        List<Event> events = repository.findPaginationByPath(path, pageRequest);
        Assert.assertTrue(count != 0);
        Assert.assertFalse(events.isEmpty());
        path = "/not/exist";
        count = repository.countByPath(path);
        events = repository.findPaginationByPath(path, pageRequest);
        Assert.assertTrue(count == 0);
        Assert.assertTrue(events != null);
        Assert.assertTrue(events.isEmpty());
        path = "/default/engine";
        count = repository.countByPath(path);
        events = repository.findPaginationByPath(path, pageRequest);
        Assert.assertTrue(count != 0);
        Assert.assertFalse(events.isEmpty());
    }

    @Test
    public void testFindDistinctPath() {
        List<String> paths = repository.findDistinctPath();
        Assert.assertTrue(paths.size() > 0);
    }

    @Test
    public void testCreate() throws Exception {
        Event event = new Event();
        event.setPath("/default/engine");
        event.setPriority(Priority.High);
        event.setSeverity(Severity.MAJOR);
        event.setAck(AckStatus.Acked);
        event.setContent("test error");
        event.creating();
        repository.create(event);
        Assert.assertNotNull(event.getId());
    }
}
