/**
 * Developer: Kadvin Date: 15/1/27 下午4:25
 */
package dnt.monitor.node;

import dnt.monitor.engine.EngineTest;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.Resource;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClientException;

import static org.junit.Assert.fail;

/**
 * <h1>测试添加group之后，各种管理员删除引擎方式</h1>
 * 涉及如下API:
 * <ol>
 * <li>POST   /engine/self
 * <li>PUT    /engine/self
 * <li>DELETE /engine/self
 * </ol>
 */
public class DeleteEngineNodeTest extends EngineTest {
    protected static MonitorEngine created;
    boolean needClean;
    @Before
    public void setup() throws Exception {
        super.setUp();

        //System.out.println(ParseUtils.toJSONString(engine));
        created = withLoginUser(new Callback<MonitorEngine>() {
            @Override
            public MonitorEngine perform(HttpHeaders headers) {
                HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(engine, headers);
                return postForObject("/engine/self", request, MonitorEngine.class);
            }
        });
        //System.out.println(ParseUtils.toJSONString(created));
        needClean = true;
    }

    @After
    public void tearDown() throws Exception {
        if( !needClean ) return;
        withLoginUser(new Job() {
            @Override
            public void perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                try {
                    delete("/api/nodes{0}", request, created.getSystemPath());
                } catch (RestClientException e) {
                    System.err.println("Failed to cleanup the engine " +
                            created.getEngineId() + ", because " + ExceptionUtils.getRootCauseMessage(e));
                }
            }
        });
    }
    /**
     * 测试：管理员直接删除引擎监控范围
     * 期望：正常删除
     * @throws Exception
     */
    @Test
    public void testDeleteByEngineScope() throws Exception {
        withLoginUser(new Job() {
            @Override
            public void perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                delete("/api/nodes" + created.getSystemPath(), request);
            }
        });
        needClean = false;
    }

    /**
     * 测试：管理员直接删除引擎
     * 期望：也可以删除
     * <p>
     *     备注：如果是默认监控引擎，其主机，应用等还被监控服务器所使用，则不能删除
     * </p>
     * @throws Exception
     */
    @Test
    public void testDeleteEngineDirectly() throws Exception {
        withLoginUser(new Job() {
            @Override
            public void perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                try {
                    delete("/api/node" + created.getSystemPath() + "/engine", request);
                    //fail("It should refuse to delete engine with other resource(host) in its monitor scope");
                    needClean = false;
                } catch (RestClientException e) {
                    System.out.println("Got expected exception " + ExceptionUtils.getRootCauseMessage(e));
                    needClean = true;
                }
            }
        });
    }

    /**
     * 测试：管理员先删除主机，再删除监控引擎
     * 期望：正常删除
     * @throws Exception
     */
    @Test
    public void testDeleteByHostAndEngine() throws Exception {
        withLoginUser(new Job() {
            @Override
            public void perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                String parentPath = "/api/node" + created.getSystemPath() ;
                String hostPath = parentPath + "/" + Resource.convertAsPath(engine.getAddress()) + "?force=true";
                String enginePath = parentPath + "/engine?force=true";
                delete(hostPath, request);
                delete(enginePath, request);
            }
        });
        needClean = false;
    }
}
