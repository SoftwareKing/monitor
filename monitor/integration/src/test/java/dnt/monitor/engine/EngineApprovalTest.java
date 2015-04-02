/**
 * Developer: Kadvin Date: 15/1/26 下午4:12
 */
package dnt.monitor.engine;

import dnt.monitor.model.MonitorEngine;
import net.happyonroad.util.ParseUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import static org.junit.Assert.*;

/**
 * 批准引擎的测试用例
 * 涉及如下API:
 * <ol>
 * <li>PUT /api/engines/{engineId}/approve?name={String}&engineName={String}
 * <li>PUT /api/engines/{engineId}/reject
 * </ol>
 */
public class EngineApprovalTest extends EngineTest {
    //因为这里没有借 HierarchicalContextRunner，而是 普通的 Junit Runner
    //并且对象并不是通过一个测试用例传递给另外一个，而是 通过 setup完成
    //所以，采用成员变量即可
    protected MonitorEngine created;
    String name;

    @Before
    public void setup() throws Exception {
        super.setUp();
        created = withLoginUser(new Callback<MonitorEngine>() {
            @Override
            public MonitorEngine perform(HttpHeaders headers) {
                HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(engine, headers);
                return postForObject("/engine/self", request, MonitorEngine.class);
            }
        });
        name = created.getName();
    }

    @After
    public void tearDown() throws Exception {
        assertNotNull(name);
        //此地不能基于引擎认证接口做删除，
        // 因为该引擎刚开始未被批准(无 api token)
        // 后来也可能被拒绝，所以要基于管理员身份进行清除
        withLoginUser(new Job() {
            @Override
            public void perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                delete("/api/nodes/infrastructure/{0}", request, name);
            }
        });
    }

    @Test
    public void testApprove() throws Exception {
        assertNotNull(created);
        MonitorEngine approved = withLoginUser(new Callback<MonitorEngine>() {
            @Override
            public MonitorEngine perform(HttpHeaders headers) {
                HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(headers);
                ResponseEntity<MonitorEngine> entity =  exchange(
                        "/api/engines/{0}/approve?name=itc&label=ItcEngine",
                        HttpMethod.PUT, request, MonitorEngine.class, created.getEngineId());
                return entity.getBody();
            }
        });
        System.out.println(ParseUtils.toJSONString(approved));
        assertEquals("ItcEngine", approved.getLabel());
        assertEquals("/infrastructure/itc", approved.getSystemPath());
        assertEquals("/itc", approved.getScopePath());
        assertTrue(approved.isApproved());
        assertNotNull(approved.getApiToken());
        name = "/itc";
    }

    @Test
    public void testReject() throws Exception {
        MonitorEngine rejected = withLoginUser(new Callback<MonitorEngine>() {
            @Override
            public MonitorEngine perform(HttpHeaders headers) {
                HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(headers);
                ResponseEntity<MonitorEngine> entity = exchange("/api/engines/{0}/reject",
                        HttpMethod.PUT, request, MonitorEngine.class, created.getEngineId());
                return entity.getBody();
            }
        });
        System.out.println(ParseUtils.toJSONString(rejected));
        assertTrue(rejected.isRejected());
        assertNull(rejected.getApiToken());
    }
}
