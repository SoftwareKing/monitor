package dnt.monitor.server.support;

import dnt.monitor.model.Resource;
import dnt.monitor.server.repository.ResourceRepository;
import dnt.monitor.server.service.ResourceService;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.platform.util.PageRequest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;

import static org.easymock.EasyMock.*;
import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = ResourceManagerConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class ResourceManagerTest {
    @Autowired
    ResourceService<Resource> service;
    @Autowired
    ResourceRepository<Resource> repository;
    @Autowired
    ComponentContext componentContext;

    Resource resource;

    @Test
    public void testPaginateByType() throws Exception {
        String type = "/device/host/linux";
        PageRequest request = new PageRequest(1, 10);
        expect(repository.countByType(type)).andReturn(5L);
        expect(repository.findAllByType(type, request)).andReturn(new ArrayList<Resource>());

        replay(repository);
        replay(componentContext);

        service.paginateByType(type, request);
    }

    @Test
    public void testCreate() throws Exception {
        expect(componentContext.getApplicationFeatures()).andStubReturn(new ArrayList<ApplicationContext>());
        repository.create(resource);
        expectLastCall().once();

        replay(repository);
        replay(componentContext);

        service.create(resource);

        assertNotNull(resource.getPerformance());
        assertNotNull(resource.getConfigStatus());
        assertNotNull(resource.getAvailability());
    }

    @Before
    public void setUp() throws Exception {
        resource = new Resource();
        resource.setType("/device/host/linux");
        resource.setAddress("192.168.10.109");
        resource.setLabel(resource.getAddress());

        reset(repository);
        reset(componentContext);
    }

    @After
    public void tearDown() throws Exception {
        verify(repository);
        verify(componentContext);
    }
}