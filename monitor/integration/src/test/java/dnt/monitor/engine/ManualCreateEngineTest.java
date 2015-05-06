package dnt.monitor.engine;

import dnt.monitor.it.AbstractTest;
import dnt.monitor.model.MonitorEngine;
import net.happyonroad.util.ParseUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

/**
 * <h1>测试通过界面手工添加引擎</h1>
 *
 * 本测试用例需要被测试的server数据为空（除了自动创建的监控服务器主机）
 * 内部分为几个步骤：
 * <ol>
 * <li> 通过界面手工添加一个引擎节点，输入：引擎名称(缺省引擎的name=default)，显示名称(以后可以调控高级参数，如默认搜索深度)
 * <li> 下载相应的安装脚本，并加以执行
 * <li> 执行之后，引擎应该向监控服务器注册，并得到自动批准
 * <li> 而后，引擎应该执行自动发现工作
 * </ol>
 *
 * @author Jay Xiong
 */
public class ManualCreateEngineTest extends AbstractTest {

    private MonitorEngine engine;

    @Before
    public void setUp() throws Exception {
        engine = new MonitorEngine();
        engine.setName("common");
        engine.setLabel("普通引擎");
    }

    /**
     * 测试创建一个普通引擎；其目标主机未知；而后用户到相应的主机上，下载执行相应的安装脚本
     * 成功后，该引擎应该被自动批准；引擎所在的主机和网络被发现
     * @throws Exception
     */
    @Test
    public void testCreateCommonEngine() throws Exception {
        //通过界面创建引擎，创建方式:
        System.out.println(ParseUtils.toJSONString(engine));
        MonitorEngine created = withLoginUser(new Callback<MonitorEngine>() {
            @Override
            public MonitorEngine perform(HttpHeaders headers) {
                HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(engine, headers);
                return postForObject("/api/engines/", request, MonitorEngine.class);
            }
        });
        System.out.println(ParseUtils.toJSONString(created));
    }

    @Test
    public void testApproveCommonEngine() throws Exception {
        MonitorEngine approved = withLoginUser(new Callback<MonitorEngine>() {
            @Override
            public MonitorEngine perform(HttpHeaders headers) {
                HttpEntity<MonitorEngine> request = new HttpEntity<MonitorEngine>(headers);
                ResponseEntity<MonitorEngine> entity =  exchange(
                        "/api/engines/{0}/approve?name=common&label=普通引擎",
                        HttpMethod.PUT, request, MonitorEngine.class, "d39037dc-26a6-407d-be64-30f5bd699420");
                return entity.getBody();
            }
        });
        System.out.println(ParseUtils.toJSONString(approved));
    }

    /**
     * 测试创建一个普通引擎，以及设定其相应主机
     * 后台应该自动远程该主机，并自动下载脚本并加以执行
     * @throws Exception
     */
    @Test
    public void testCreateCommonEngineOnTargetHost() throws Exception {


    }
}
