/**
 * Developer: Kadvin Date: 14/12/30 下午6:01
 */
package dnt.monitor.node;

import de.bechte.junit.runners.context.HierarchicalContextRunner;
import dnt.monitor.it.AbstractTest;
import dnt.monitor.model.*;
import net.happyonroad.type.*;
import net.happyonroad.util.ParseUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * <h1>测试节点管理的动作</h1>
 * 涉及如下API:
 * <ol>
 * <li>POST   /api/nodes/**
 * <li>DELETE /api/nodes/**
 * <li>PUT    /api/node/**
 * </ol>
 * 依赖于测试数据套件(dnt.monitor.data_suite)
 */
@SuppressWarnings("UnusedDeclaration")
@RunWith(HierarchicalContextRunner.class)
public class NodesTest extends AbstractTest {
    static ResourceNode simple, complex;

    ResourceNode node;
    Host host;
    CPU cpu0, cpu1, cpu2;

    @Before
    public void setUp() throws Exception {

        node = new ResourceNode();
        node.setLocation(new Location(123, 234));
        node.setProperty(Resource.PROPERTY_RELATIVE_PATH, "192_168_10_199");
        node.setLabel("192.168.10.199");
        node.setIcon("linux");
        node.setComment("a node for test host");
        node.setState(State.Stopped);
        node.setPriority(Priority.High);
        node.setOrganization("itsnow");
        Schedule schedule = new Schedule();
        schedule.setFrequency(new TimeInterval("5s"));
        long now = System.currentTimeMillis();
        schedule.setStartAt(new Date(now - 12832020));
        schedule.setEndAt(new Date(now + 19293202));
        node.setSchedule(schedule);
        TimeSpan span = new TimeSpan();
        span.setStartAt(new Date(now + 103920));
        span.setEndAt(new Date(now + 193920));
        node.setMaintainWindow(span);

        host = new Host();
        node.setResource(host);

        host.setType("/device/host/linux");
        host.setAddress("192.168.10.199");
        host.setLabel(host.getAddress());
        host.setDescription("A test host");
        host.setPerformance(Performance.Normal);
        host.setConfigStatus(ConfigStatus.Changed);
        host.setAvailability(Availability.Unavailable);
        host.setHostname("it-test-host");
        host.setManufacturer("Dell");
        host.setModelName("Dell 2800");
        host.setOs("Windows 2003 Server");
        host.setVersion("2003.12");
        host.setSerialNumber("1203920");
        host.setDomain("workstation");
        host.setCpuCount(4);
        host.setStartAt(new Date(now - 12802020));
        host.setUpTime("any time");
        host.setLocalTime(new Timestamp(now));
        host.setDescription("The it test host");
        host.setProcessCount(100);
        host.setProperty("creator", "integration");

        cpu0 = createCPU(0, Performance.Warning);
        cpu1 = createCPU(1, Performance.Normal);
        cpu2 = createCPU(2, Performance.Critical);
    }

    CPU createCPU(int i, Performance performance) {
        CPU cpu = new CPU();
        cpu.setIdx(i);
        cpu.setModelName("Intel Xeron");
        cpu.setFrequency(1024f);
        cpu.setUsage(0.7f);
        cpu.setUsrUsage(0.6f);
        cpu.setSysUsage(0.1f);
        cpu.setIdle(0.3f);
        cpu.setIoWait(0.1f);
        cpu.setPerformance(performance);
        cpu.setConfigStatus(ConfigStatus.Unchanged);
        cpu.setAvailability(Availability.Available);
        return cpu;
    }

    @Test
    public void testCreateNodeWithSimpleHost() throws Exception {
        System.out.println(ParseUtils.toJSONString(node));
        simple = withLoginUser(new Callback<ResourceNode>() {
            @Override
            public ResourceNode perform(HttpHeaders headers) {
                HttpEntity<ResourceNode> request = new HttpEntity<ResourceNode>(node, headers);
                return postForObject("/api/nodes/default", request, ResourceNode.class);
            }
        });
        System.out.println(ParseUtils.toJSONString(simple));
    }


    @Test
    public void testCreateNodeWithComplexHost() throws Exception {
        String address = "192.168.10.299";
        node.setLabel(address);
        node.setProperty(Resource.PROPERTY_RELATIVE_PATH, "192_168_10_299");
        host.setAddress(address);
        host.setLabel(address);
        host.setCPU(cpu0);
        List<CPU> cpus = new ArrayList<CPU>(2);
        cpus.add(cpu1);
        cpus.add(cpu2);
        host.setCPUs(cpus);

        System.out.println(ParseUtils.toJSONString(node));
        complex = withLoginUser(new Callback<ResourceNode>() {
            @Override
            public ResourceNode perform(HttpHeaders headers) {
                HttpEntity<ResourceNode> request = new HttpEntity<ResourceNode>(node, headers);
                return postForObject("/api/nodes/default", request, ResourceNode.class);
            }
        });
        System.out.println(ParseUtils.toJSONString(complex));
    }

    public class UpdateContext {

        @Test
        public void testUpdateGroup() throws Exception {
            final ManagedNode defaultScope = withLoginUser(new Callback<ManagedNode>() {
                @Override
                public ManagedNode perform(HttpHeaders headers) {
                    HttpEntity<ManagedNode> request = new HttpEntity<ManagedNode>(simple, headers);
                    return getForObject("/api/node/default", ManagedNode.class, request);
                }
            });
            defaultScope.setLabel("缺省范围");
            defaultScope.setIcon("Default Icon");
            defaultScope.setComment("Updated scope");
            defaultScope.setProperty("Extra-Updated", "Nothing");
            ManagedNode updatedScope = withLoginUser(new Callback<ManagedNode>() {
                @Override
                public ManagedNode perform(HttpHeaders headers) {
                    HttpEntity<ManagedNode> request = new HttpEntity<ManagedNode>(defaultScope, headers);
                    ResponseEntity<ManagedNode> entity =  exchange(
                            "/api/node/default", HttpMethod.PUT, request, ManagedNode.class);
                    return entity.getBody();
                }
            });
            assertEquals(defaultScope.getLabel(), updatedScope.getLabel());
            assertEquals(defaultScope.getIcon(), updatedScope.getIcon());
            assertEquals(defaultScope.getComment(), updatedScope.getComment());
            assertEquals(defaultScope.getProperty("Extra-Updated"), updatedScope.getProperty("Extra-Updated"));
        }

        @Test
        public void testUpdateSimpleNode() throws Exception {
            final String path = "default/192_168_10_199";
            simple.setLabel("192.168.10.120");
            simple.getSchedule().setFrequency(new TimeInterval("10s"));
            // not implemented now
            simple.getResource().setAddress("192.168.10.120");
            ManagedNode updated = withLoginUser(new Callback<ManagedNode>() {
                @Override
                public ManagedNode perform(HttpHeaders headers) {
                    HttpEntity<ManagedNode> request = new HttpEntity<ManagedNode>(simple, headers);
                    ResponseEntity<ManagedNode> entity =  exchange(
                            "/api/node/{0}", HttpMethod.PUT, request, ManagedNode.class, path);
                    return entity.getBody();
                }
            });
            System.out.println(ParseUtils.toJSONString(updated));
            assertEquals("192.168.10.120", updated.getLabel());
            assertEquals("10s", updated.getSchedule().getFrequency().toString());


        }

        public class DeleteContext {
            @Test
            public void testDeleteNodeWithSimpleHost() throws Exception {
                withLoginUser(new Job() {
                    @Override
                    public void perform(HttpHeaders headers) {
                        HttpEntity request = new HttpEntity(headers);
                        delete("/api/node/default/192_168_10_199", request);
                    }
                });
            }


            @Test
            public void testDeleteNodeWithComplexHost() throws Exception {
                withLoginUser(new Job() {
                    @Override
                    public void perform(HttpHeaders headers) {
                        HttpEntity request = new HttpEntity(headers);
                        delete("/api/node/default/192_168_10_299", request);
                    }
                });
            }
        }
    }
}
