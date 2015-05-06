/**
 * Developer: Kadvin Date: 15/1/21 下午5:19
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.jmx.JmxVisitor;
import dnt.monitor.engine.jmx.JmxVisitorFactory;
import dnt.monitor.engine.service.SampleService;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.service.MetaService;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.StringUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.Properties;

/**
 * <h1>引擎的身份管理</h1>
 *
 * 引擎启动时，应该检查自己的身份，分为如下几种:
 *
 * <ol>
 * <li> 引擎未注册:
 * engineId = empty, api_token = empty
 * <li> 引擎未被批准:
 * engineId = &lt;valid one &gt;, api_token = empty
 * <li> 引擎已注册:
 * engineId = &lt;valid one &gt;, api_token = &lt; valid one &gt;
 * <li> 引擎已失效:
 * engineId = &lt;valid one &gt;, api_token = &lt; invalid one &gt;
 * </ol>
 * 对于以上情况，IdentifyManager应该执行不同的策略，包括：
 * <ol>
 * <li> 通过监控服务器南向接口发起注册，注册成功之后更新自己的engineId
 * 但此时由于未得到管理员的批准，所以尚无 api token；(缺省引擎将会被自动批准）
 * 如果不能注册成功，那么系统应该停住，并不断尝试注册
 * <li> 系统应该继续运行，让SessionManager与服务器建立会话，
 * 等待服务器通知本引擎已经被批准
 * <li> 系统应该继续运行，让SessionManager与服务器建立会话，并接受服务器发来的其他命令
 * <li> 系统应该显示本引擎已经失效，并退出
 * </ol>
 */
@Component
class IdentityManager extends ApplicationSupportBean
        implements ApplicationListener<SystemStartedEvent>{
    @Value("${server.address}")
    private String  serverAddress;
    @Value("${server.port}")
    private Integer serverPort;

    @Autowired
    MetaService metaService;
    @Autowired
    JmxVisitorFactory jmxVisitorFactory;
    @Autowired
    @Qualifier("jmxSampleService")
    SampleService     sampleService;

    public IdentityManager() {
        //系统启动第1件事情，就是身份管理
        setOrder(1000);
    }

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        String engineId = getEngineId();
        if (StringUtils.isEmpty(engineId)) {
            //手工发布的引擎，在服务器上没有记录
            engineId = performRegistration();
        }
        String apiToken = getApiToken();
        if (StringUtils.isEmpty(apiToken)) {
            //在服务器上先建立记录，（但没有批准），再下载下来的引擎
            performRegistration();
        }
        boolean valid = performValidation(engineId, apiToken);
        if (!valid) {
            logger.error("The engine {}/{} is blocked, exit now", engineId, apiToken);
            System.exit(1);
        }
    }


    String performRegistration() {
        String address = System.getProperty("app.host");
        //address = localhost as default
        if ("localhost".equalsIgnoreCase(address)) {
            Collection<String> localAddresses = IpUtils.getLocalAddresses();
            if (localAddresses.isEmpty()) {
                throw new ApplicationContextException("The engine host network is not configured!");
            }
            address = localAddresses.iterator().next();
        }
        MonitorEngine engine = createLocalEngine(address);
        RestTemplate rest = new RestTemplate();
        MonitorEngine registered = null;
        while (registered == null) {
            try {
                logger.info("Registering as {}", engine);
                registered = rest.postForObject("http://{0}:{1}/engine/self",
                                                engine, MonitorEngine.class, serverAddress, serverPort);
                logger.info("Registered  as {}", registered);
            } catch (RestClientException e) {
                logger.warn("Failed to register {}, because of {}", engine, MiscUtils.describeException(e));
                try {
                    Thread.sleep(1000 * 30);
                } catch (InterruptedException e1) {
                    //ignore
                }
            }
        }
        updateEngine(registered);
        return registered.getEngineId();
    }

    //注册成功之后，不需要发出什么事件
    // 因为现在考虑注册是所有工作的前置条件
    private void updateEngine(MonitorEngine registered) {
        String engineId = registered.getEngineId();
        String apiToken = registered.getApiToken();
        if (apiToken == null ) apiToken = "";
        logger.info("{} registered with {}/{}", registered, engineId, apiToken);
        Properties identities = new Properties();
        identities.setProperty("engine.id", engineId);
        identities.setProperty("engine.apiToken", apiToken);
        System.setProperty("engine.id", engineId);
        System.setProperty("engine.apiToken", apiToken);

        File file = new File(System.getProperty("app.home"), "config/identity.properties");
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            identities.store(fos, "Engine Identities");
        } catch (IOException e) {
            logger.error("Can't update engine identity", e);
        }finally {
            IOUtils.closeQuietly(fos);
        }

    }

    MonitorEngine createLocalEngine(String address){
        ResourceNode node = new ResourceNode();

        MonitorEngine engine = new MonitorEngine();
        node.setResource(engine);
        String jmxPort = System.getProperty("com.sun.management.jmxremote.port", "1096");
        engine.setAddress(address + ":" + jmxPort);
        // Engine name is assigned by server
        // 1. default engine: server judge it's host address
        // 2. pre-assigned engine: server judge it's identify
        // 3. manual installed engine: pending_x first, admin assigned while approving
        engine.setPerformance(Performance.Normal);
        engine.setConfigStatus(ConfigStatus.Unchanged);
        // Session Created之后会自行维护这个字段
        engine.setAvailability(Availability.Unavailable);
        try {
            //noinspection unchecked
            MetaResource model = (MetaResource<MonitorEngine>) metaService.resolve(MonitorEngine.class);
            JmxVisitor visitor = jmxVisitorFactory.visitor(node, new CredentialProperties());
            MonitorEngine sampled = (MonitorEngine) sampleService.sampleResource(visitor, model);
            sampled.setEngineId(sampled.getProperty("engine.id"));
            sampled.setApiToken(sampled.getProperty("engine.apiToken"));
            return sampled;
        } catch (Exception e) {
            throw new ApplicationContextException("Can't sample engine itself", e);
        }
    }

    boolean performValidation(String engineId, String apiToken) {
        //TODO 验证这个配置文件是正确的
        return engineId != null && !engineId.isEmpty();
    }


    String getEngineId() {
        return System.getProperty("engine.id");
    }

    String getApiToken() {
        return System.getProperty("engine.apiToken");
    }

}
