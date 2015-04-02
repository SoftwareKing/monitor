/**
 * Developer: Kadvin Date: 15/1/11 下午9:38
 */
package dnt.monitor.engine;

import de.bechte.junit.runners.context.HierarchicalContextRunner;
import dnt.monitor.model.MonitorEngine;
import net.happyonroad.util.ParseUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * <h1>测试引擎自动注册的动作</h1>
 * 涉及如下API:
 * <ol>
 * <li>POST   /engine/self
 * <li>PUT    /engine/self
 * <li>DELETE /engine/self
 * </ol>
 *
 */
@RunWith(HierarchicalContextRunner.class)
public class AutoRegisterTest extends EngineTest {
    // 这个变量必须为静态变量，否则无法让一个测试用例执行完毕之后，传递给另外一个测试用例
    // 我这里讨了一个巧，因为 HierarchicalContextRunner 会先执行外围测试用例
    // 而后执行内层测试用例；但在内外两个测试用例之间的测试对象（AutoRegisterTest instance）是重新创建的
    // 故而，将 `created`设置为成员变量无法实现内外测试用例之间的变量传递
    // 所以，需要将该变量设置为静态变量
    // engineConfiguration也是
    protected static MonitorEngine created;
    @Override
    public void setUp() throws Exception {
        super.setUp();
        engine.setProperty("autoApproveForIntegration", "true");
    }

    @Test
    public void testRegister() throws Exception {
        System.out.println(ParseUtils.toJSONString(engine));
        created = withLoginUser(new Callback<MonitorEngine>() {
            @Override
            public MonitorEngine perform(HttpHeaders headers) {
                HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(engine, headers);
                return postForObject("/engine/self", request, MonitorEngine.class);
            }
        });
        System.out.println(ParseUtils.toJSONString(created));
    }

    @SuppressWarnings("UnusedDeclaration")
    public class UpdateContext {
        @Test
        public void testUpdate() throws Exception {
            assertNotNull(created);
            created.setLabel("Updated Engine");
            engineConfiguration.username(created.getEngineId());
            engineConfiguration.password(created.getApiToken());

            MonitorEngine updated = withLoginEngine(new Callback<MonitorEngine>() {
                @Override
                public MonitorEngine perform(HttpHeaders headers) {
                    HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(created, headers);
                    ResponseEntity<MonitorEngine> entity = exchange("/engine/self",
                            HttpMethod.PUT, request, MonitorEngine.class);
                    return entity.getBody();
                }
            });
            assertEquals("Updated Engine", updated.getLabel());
        }
        public class DeleteContext {
            @Test
            public void testUnregister() throws Exception {
                assertNotNull(created);
                engineConfiguration.username(created.getEngineId());
                engineConfiguration.password(created.getApiToken());

                withLoginEngine(new Job() {
                    @Override
                    public void perform(HttpHeaders headers) {
                        HttpEntity request = new HttpEntity(headers);
                        delete("/engine/self", request);
                    }
                });
            }
        }
    }

}
