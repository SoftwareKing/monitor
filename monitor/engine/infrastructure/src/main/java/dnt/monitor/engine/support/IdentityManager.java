/**
 * Developer: Kadvin Date: 15/1/21 下午5:19
 */
package dnt.monitor.engine.support;

import dnt.monitor.model.Host;
import dnt.monitor.model.LinuxHost;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.WindowsHost;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.StringUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SystemUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

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
class IdentityManager extends ApplicationSupportBean{
    @Value("${server.address}")
    private String serverAddress;
    @Value("${server.port}")
    private Integer serverPort;

    @Override
    protected void performStart() {
        super.performStart();
        String engineId = getEngineId();
        if(StringUtils.isEmpty(engineId)){
            //尚未注册
            performRegistration();
        }
        String apiToken = getApiToken();
        if( StringUtils.isEmpty(apiToken)){
            logger.warn("{} not approved", engineId);
        }else{
            boolean valid = performValidation(engineId, apiToken);
            if( ! valid ){
                logger.error("The engine {}/{} is blocked, exit now", engineId, apiToken);
                System.exit(1);
            }
        }
    }

    void performRegistration() {
        MonitorEngine engine = createLocalEngine();
        Host host = createLocalhost();
        host.setAddress(engine.getAddress());
        host.setLabel(host.getAddress());
        engine.setHost(host);
        RestTemplate rest = new RestTemplate();
        MonitorEngine registered = null;
        while(registered == null){
            try {
                logger.info("Registering as {}", engine);
                registered = rest.postForObject("http://{0}:{1}/engine/self",
                        engine, MonitorEngine.class, serverAddress, serverPort);
                logger.info("Registered  as {}", engine);
            } catch (RestClientException e) {
                logger.warn("Failed to register {}, because of {}", engine, ExceptionUtils.getRootCauseMessage(e));
                try {
                    Thread.sleep(1000 * 30);
                } catch (InterruptedException e1) {
                    //ignore
                }
            }
        }
        updateEngine(registered);
    }

    //注册成功之后，不需要发出什么事件
    // 因为现在考虑注册是所有工作的前置条件
    private void updateEngine(MonitorEngine registered) {
        String engineId = registered.getEngineId();
        String apiToken = registered.getApiToken();
        if( apiToken == null ) apiToken = "";
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

    MonitorEngine createLocalEngine(){
        MonitorEngine engine = new MonitorEngine();
        // Engine name is assigned by server
        // 1. default engine: server judge it's host address
        // 2. pre-assigned engine: server judge it's identify
        // 3. manual installed engine: pending_x first, admin assigned while approving
        engine.setPerformance(Performance.Normal);
        engine.setConfigStatus(ConfigStatus.Unchanged);
        // Session Created之后会自行维护这个字段
        engine.setAvailability(Availability.Unavailable);

        Set<Integer> pids = new HashSet<Integer>();
        String pid = ManagementFactory.getRuntimeMXBean().getName().split("@")[0];
        pids.add(Integer.valueOf(pid));
        engine.setPids(pids);

        Set<String> localAddresses = IpUtils.getLocalAddresses();
        if( localAddresses.isEmpty() )
            throw new ApplicationContextException("The engine host network is not configured!");
        String address = localAddresses.iterator().next();
        engine.setAddress(address);
        engine.setHome(SystemUtils.getUserDir().getAbsolutePath());
        engine.setLabel(engine.getAddress());

        Properties properties = new Properties();
        FileInputStream fis = null;
        try {
            File configFile = new File(System.getProperty("app.home"), "config/engine.properties");
            fis = new FileInputStream(configFile);
            properties.load(fis);
        } catch (IOException e) {
            logger.warn("Can't load engine properties", e);
        } finally {
            IOUtils.closeQuietly(fis);
        }
        engine.setProperties(properties);
        localAddresses.remove(address);
        if( !localAddresses.isEmpty() ){
            engine.setProperty("addresses", StringUtils.join(localAddresses, ";"));
        }
        return engine;
    }

    // TODO 采用本机对象采集/刷新接口
    Host createLocalhost() {
        Host host;
        if( SystemUtils.IS_OS_WINDOWS){
            host = new WindowsHost();
            host.setType("/device/host/windows");
        }else {  //actually, Mac OSX in my env
            host = new LinuxHost();
            host.setType("/device/host/linux");
        }
        host.setDescription("The host description");
        host.setPerformance(Performance.Normal);
        host.setConfigStatus(ConfigStatus.Unchanged);
        host.setAvailability(Availability.Available);
        host.setHostname("it-test-host");
        host.setManufacturer("Dell");
        host.setModelName("Dell 2800");
        host.setOs(SystemUtils.OS_NAME);
        host.setVersion(SystemUtils.OS_VERSION);
        host.setSerialNumber("The host SN");
        host.setDomain("The host domain");
        host.setStartAt(new Date(System.currentTimeMillis() - 12802020));
        host.setUpTime("any time");
        host.setLocalTime(new Timestamp(System.currentTimeMillis()));
        host.setProcessCount(100);
        return host;
    }

    boolean performValidation(String engineId, String apiToken) {
        return true;
    }


    String getEngineId() {
        return System.getProperty("engine.id");
    }

    String getApiToken() {
        return System.getProperty("engine.apiToken");
    }

}
