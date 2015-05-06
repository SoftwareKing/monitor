package dnt.monitor.server.repository;

import dnt.monitor.model.Resource;
import net.happyonroad.platform.util.PageRequest;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;


@ContextConfiguration(classes = ResourceRepositoryConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class ResourceRepositoryTest {

    @Autowired
    ResourceRepository<Resource> repository;
    private Resource resource;

    @Before
    public void setUp() throws Exception {
        resource = new Resource();
        resource.setType("/device/host/linux");
        resource.setAddress("192.168.10.109");
        resource.setLabel(resource.getAddress());
        resource.setPerformance(Performance.Unknown);
        resource.setConfigStatus(ConfigStatus.Unknown);
        resource.setAvailability(Availability.Unknown);
    }

    @After
    public void tearDown() throws Exception {
        if (resource.getId() != null) repository.deleteById(resource.getId());
    }

    @Test
    public void testCountByType() throws Exception {
        long count = repository.countByType("/device/host/linux");
        Assert.assertEquals(2, count);
    }

    @Test
    public void testFindAllByType() throws Exception {
        PageRequest request = new PageRequest(0, 10);
        List<Resource> list = repository.findAllByType("/device/host/linux", request);
        Assert.assertNotNull(list);
        Assert.assertEquals(2, list.size());
    }

    @Test
    public void testFindById() throws Exception {
        Resource resource = repository.findById(2L);
        Assert.assertFalse(resource.getOutLinks().isEmpty());
        //Assert.assertFalse(resource.getInLinks().isEmpty());
    }

    @Test
    public void testCreate() throws Exception {
        repository.create(resource);
        Assert.assertNotNull(resource.getId());
    }

    @Test
    public void testUpdate() throws Exception {
        repository.create(resource);
        resource.setLabel("New Label");
        repository.update(resource);
        Resource updated = repository.findById(resource.getId());
        Assert.assertEquals("New Label", updated.getLabel());
    }
}