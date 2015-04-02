package dnt.monitor.server.repository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = EngineRepositoryConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
public class MonitorServerRepositoryTest {
    @Autowired
    MonitorServerRepository repository;

    @Test
    public void testFindServer() throws Exception {
        assertNotNull(repository.findServer());
    }

    @Test
    public void testCreateServer() throws Exception {

    }

    @Test
    public void testUpdateServer() throws Exception {

    }
}