package dnt.monitor.server.repository;

import dnt.monitor.model.ApproveStatus;
import dnt.monitor.model.MonitorEngine;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = EngineRepositoryConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
public class EngineRepositoryTest {
    @Autowired
    EngineRepository repository;
    MonitorEngine engine;

    @Before
    public void setUp() throws Exception {
        engine = new MonitorEngine();
        engine.setType("/app/jvm/monitor/engine");
        engine.setAddress("192.168.10.100");
        engine.setHome("/path/to/started/engine");
        engine.setLabel("Test Engine");
        engine.setName("test");
        engine.setEngineId(UUID.randomUUID().toString());
        Set<Integer> pids = new HashSet<Integer>();
        pids.add(1023);
        pids.add(1024);
        pids.add(1025);
        pids.add(1026);
        engine.setPids(pids);
    }

    @Test
    public void testFindById() throws Exception {
        MonitorEngine engine = repository.findById(2L);
        validateDefaultEngine(engine);
    }

    @Test
    public void testFindByEngineId() throws Exception {
        MonitorEngine engine = repository.findByEngineId("00-11-22-33-44");
        validateDefaultEngine(engine);
    }

    @Test
    public void testFindAllByStatus() throws Exception {
        List<MonitorEngine> approveds = repository.findAllByApproveStatus(ApproveStatus.Approved);
        assertEquals(1, approveds.size());

        List<MonitorEngine> requesteds = repository.findAllByApproveStatus(ApproveStatus.Requested);
        assertEquals(1, requesteds.size());

    }

    @Test
    public void testCreate() throws Exception {
        repository.create(engine);
        MonitorEngine found = repository.findByEngineId(engine.getEngineId());
        assertNotNull(found);
    }

    @Test
    //@Ignore("H2 Not support multiple SQL statements; see: org.h2.command.Parser line#275 ")
    public void testUpdate() throws Exception {
        repository.create(engine);
        try {
            engine.setHome("/path/to/new/home");
            repository.update(engine);
            MonitorEngine found = repository.findByEngineId(engine.getEngineId());
            assertEquals("/path/to/new/home", found.getHome());
        } finally {
            repository.deleteById(engine.getId());
        }
    }

    void validateDefaultEngine(MonitorEngine engine) {
        assertEquals("/opt/monitor/engine", engine.getHome());
        assertEquals("00-11-22-33-44", engine.getEngineId());
        assertEquals("secret-api-token", engine.getApiToken());
        assertNotNull(engine.getHost());
        Set<Integer> pids = new HashSet<Integer>();
        pids.add(1092);
        pids.add(1302);
        pids.add(1032);
        assertEquals(pids, engine.getPids());
    }
}