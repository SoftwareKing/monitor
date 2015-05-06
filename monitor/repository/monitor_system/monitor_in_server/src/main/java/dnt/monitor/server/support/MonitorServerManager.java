/**
 * Developer: Kadvin Date: 15/1/23 上午10:04
 */
package dnt.monitor.server.support;

import dnt.monitor.model.MonitorServer;
import dnt.monitor.server.repository.MonitorServerRepository;
import dnt.monitor.server.service.MonitorServerService;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.IpUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SystemUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.util.Collection;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

/**
 * <h1>监控服务器管理</h1>
 */
@Component
class MonitorServerManager extends Bean
        implements MonitorServerService, ApplicationListener<SystemStartedEvent> {
    @Autowired
    MonitorServerRepository repository;

    MonitorServer server;

    public MonitorServerManager() {
        setOrder(1000);
    }

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        server = repository.findServer();
        if( server == null ){
            //TODO 将server所在的主机也简单的构建出来
            // server所在的主机与默认引擎所在的主机未必是同一台主机
            server = initServer();
            create(server);
            //server所在的主机信息，稍后由默认监控引擎
        }else{
            //检查服务器地址是否有更新
            updateServerAddress(server);
            update(server);
        }
    }

    @Override
    public MonitorServer getServer() {
        return server;
    }

    @Override
    public void updateServer(MonitorServer server) {
        repository.updateServer(server);
    }

    // 这是在系统第一次启动时，自动创建监控服务器对象
    void create(MonitorServer server){
        logger.info("Auto creating {}", server);
        repository.createServer(server);
        logger.info("Auto created  {}", server);
    }

    // 这是在每次系统启动时，自动根据本机的地址信息更新服务器地址
    void update(MonitorServer server) {
        logger.info("Auto updating {}", server);
        repository.updateServer(server);
        logger.info("Auto updated  {}", server);
    }

    MonitorServer initServer() {
        //这一步创建的对象，稍后等到对象同步时，会被 缺省引擎 通过jmx监控获取到的对象替代
        MonitorServer server = new MonitorServer();
        server.setAvailability(Availability.Available);
        server.setPerformance(Performance.Normal);
        server.setConfigStatus(ConfigStatus.Unchanged);
        server.setLabel("监控服务器");
        Properties properties = new Properties();
        FileInputStream fis = null;
        try {
            File configFile = new File(System.getProperty("app.home"), "config/server.properties");
            fis = new FileInputStream(configFile);
            properties.load(fis);
        } catch (IOException e) {
            logger.warn("Can't load engine properties", e);
        } finally {
            IOUtils.closeQuietly(fis);
        }
        server.setProperties(properties);
        server.setProperty("Creator", getClass().getName());

        Set<Integer> pids = new HashSet<Integer>();
        String pid = ManagementFactory.getRuntimeMXBean().getName().split("@")[0];
        pids.add(Integer.valueOf(pid));
        server.setPids(pids);

        updateServerAddress(server);
        return server;
    }

    void updateServerAddress(MonitorServer server) {
        String address = System.getProperty("app.host");
        //address = localhost as default
        if( "localhost".equalsIgnoreCase(address) ){
            Collection<String> localAddresses = IpUtils.getLocalAddresses();
            if( localAddresses.isEmpty() ) {
                throw new ApplicationContextException("The server host network is not configured!");
            }
            address = localAddresses.iterator().next();
        }
        String jmxPort = System.getProperty("com.sun.management.jmxremote.port", "1097");
        server.setAddress(address + ":" + jmxPort);
        server.setHome(SystemUtils.getUserDir().getAbsolutePath());

    }
}
