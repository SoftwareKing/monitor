package dnt.monitor.server.support;

import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.CPU;
import dnt.monitor.model.Host;
import dnt.monitor.server.repository.HostRepository;
import dnt.monitor.server.service.HostService;
import dnt.monitor.service.MetaService;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.platform.util.PageRequest;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import org.easymock.IAnswer;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Date;

import static org.easymock.EasyMock.*;

@ContextConfiguration(classes = HostManagerConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class HostManagerTest {
    @Autowired
    HostService<Host> service;
    @Autowired
    HostRepository<Host> repository;
    @Autowired
    ComponentContext componentContext;
    @Autowired
    MetaService metaService;

    Host host;

    @Test
    public void testPaginateByKeyword() throws Exception {
        String keyword = "key";
        PageRequest request = new PageRequest(1, 10);
        expect(repository.countByKeyword(keyword)).andReturn(5L);
        expect(repository.findAllByKeyword(keyword, request)).andReturn(new ArrayList<Host>());


        replay(repository);
        replay(componentContext);

        service.paginateByKeyword(keyword, request);

    }

    @Test
    public void testFindById() throws Exception {
        final Long id = 2014L;
        final CPU cpu = new CPU();
        expect(metaService.getMetaResource(anyString())).andReturn(new MetaResource(Host.class));
        expect(repository.findById(id)).andAnswer(new IAnswer<Host>() {
            @Override
            public Host answer() throws Throwable {
                host.setId(id);
                host.setCPU(cpu);
                return host;
            }
        });
        replay(repository);
        replay(componentContext);
        replay(metaService);
        service.findById(id);
        Assert.assertEquals(host, cpu.getResource());
    }

    @Test
    public void testFindByAddress() throws Exception {
        final Long id = 2015L;
        final CPU cpu = new CPU();
        final String address = host.getAddress();
        expect(repository.findByAddress(address)).andAnswer(new IAnswer<Host>() {
            @Override
            public Host answer() throws Throwable {
                host.setId(id);
                host.setCPU(cpu);
                return host;
            }
        });
        expect(metaService.getMetaResource(anyString())).andReturn(new MetaResource(Host.class));
        replay(repository);
        replay(componentContext);
        replay(metaService);

        service.findByAddress(address);
        Assert.assertEquals(host, cpu.getResource());
    }

    @Test
    public void testCreate() throws Exception {
        expect(componentContext.getApplicationFeatures()).andStubReturn(new ArrayList<ApplicationContext>());
        final Long id = 2016L;
        final CPU cpu = new CPU();
        repository.create(host);
        expectLastCall().andAnswer(new IAnswer<Void>() {
            @Override
            public Void answer() throws Throwable {
                host.setId(id);
                host.setCPU(cpu);
                return null;
            }
        });
        repository.createCPU(cpu);
        expectLastCall().once();

        replay(repository);
        replay(componentContext);

        service.create(host);

        Assert.assertEquals(host, cpu.getResource());
    }

    @Before
    public void setUp() throws Exception {
        host = new Host();
        host.setType("/device/host/linux");
        host.setAddress("192.168.10.199");
        host.setLabel(host.getAddress());
        host.setDescription("A test host");
        host.setPerformance(Performance.Normal);
        host.setConfigStatus(ConfigStatus.Changed);
        host.setAvailability(Availability.Unavailable);
        host.setModelName("Dell 2800");
        host.setOs("Windows 2003 Server");
        host.setVersion("2003.12");
        host.setSerialNumber("1203920");
        host.setDomain("workstation");
        host.setUpTime("any time");
        host.setLocalTime(new Date());
        host.setProperty("test", "value");

        reset(repository);
        reset(componentContext);
        reset(metaService);
    }

    @After
    public void tearDown() throws Exception {
        verify(repository);
        verify(componentContext);
    }

}