/**
 * Developer: Kadvin Date: 15/1/23 上午10:04
 */
package dnt.monitor.server.support;

import dnt.monitor.model.MonitorServer;
import dnt.monitor.server.repository.MonitorServerRepository;
import dnt.monitor.server.service.MonitorServerService;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.StringUtils;
import org.apache.commons.lang.SystemUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Component;

import java.lang.management.ManagementFactory;
import java.util.HashSet;
import java.util.Set;

/**
 * <h1>监控服务器管理</h1>
 */
@Component
class MonitorServerManager extends Bean implements MonitorServerService {
    @Autowired
    MonitorServerRepository repository;

    MonitorServer server;

    @Override
    protected void performStart() {
        super.performStart();
        server = repository.findServer();
        if( server == null ){
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
        MonitorServer server = new MonitorServer();
        server.setAvailability(Availability.Available);
        server.setPerformance(Performance.Normal);
        server.setConfigStatus(ConfigStatus.Unchanged);
        server.setLabel("监控服务器");
        server.setProperty("Creator", getClass().getName());

        Set<Integer> pids = new HashSet<Integer>();
        String pid = ManagementFactory.getRuntimeMXBean().getName().split("@")[0];
        pids.add(Integer.valueOf(pid));
        server.setPids(pids);

        updateServerAddress(server);
        return server;
    }

    void updateServerAddress(MonitorServer server) {
        Set<String> localAddresses = IpUtils.getLocalAddresses();
        if( localAddresses.isEmpty() )
            throw new ApplicationContextException("The server host network is not configured!");
        String address = localAddresses.iterator().next();
        server.setAddress(address);
        server.setHome(SystemUtils.getUserDir().getAbsolutePath());

        localAddresses.remove(address);
        if( !localAddresses.isEmpty() ){
            server.setProperty("addresses", StringUtils.join(localAddresses, ";"));
        }
    }
}
