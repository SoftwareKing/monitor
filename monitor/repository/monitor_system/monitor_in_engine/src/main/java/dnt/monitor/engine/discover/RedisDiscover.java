package dnt.monitor.engine.discover;

import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.model.Host;
import dnt.monitor.model.Process;
import dnt.monitor.model.Redis;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.MiscUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashSet;
import java.util.List;
import java.util.Properties;
import java.util.Set;

/**
 * <h1>发现主机上的Redis应用</h1>
 * 基于实际进程进行发现，其实还有
 * <ul>
 * <li>基于服务(chkconfig --list) 可以发现未被启动的redis服务，但也会发现配置错误的无效redis
 * <li>基于端口(tcp:6379)， 有缺陷，无法发现修改过的端口，无法发现以domain socket方式提供服务的端口
 * <li>基于unix socket文件(redis.sock)，与基于端口类似，另外，在各个os上面，配置的.sock路径也不太一样
 * <li>基于配置文件 redis.conf
 * </ul>
 *
 * @author Jay Xiong
 */
@Component
class RedisDiscover extends DiscoverByProcess<Redis> {

    protected String filterScript(Host host){
        if(host.getType().startsWith("/device/host/windows")){
            // windows 实际执行的是 tasklist
            return "| findstr redis-server.exe";
        }else {//treat as linux
            return "| grep redis-server | grep -v grep";
        }
    }

    protected Redis createResource(List<Process> processes) {
        Redis redis = new Redis();
        redis.setType("/app/redis");
        Set<Integer> pids = new HashSet<Integer>();
        for (Process process : processes) {
            pids.add(process.getPid());
        }
        redis.setPids(pids);
        redis.setAvailability(Availability.Available);
        redis.setConfigStatus(ConfigStatus.Unchanged);
        redis.setPerformance(Performance.Normal);
        return redis;
    }

    @Override
    protected String judgeAppHome(ShellVisitor visitor, Host host, Redis redis) throws SampleException {
        return redis.getProperty("dir");
    }

    @Override
    protected Properties readAppProperties(ShellVisitor visitor, Host host, Redis redis) throws SampleException {
        String configScript = readConfigScript(host);
        String configContent = visitor.perform(configScript);
        Properties properties = new Properties();
        StringReader reader = new StringReader(configContent);
        try {
            properties.load(reader);
        } catch (IOException e) {
            logger.warn("Can't load redis.conf as properties", MiscUtils.describeException(e));
        }
        //merge with exist
        properties.putAll(redis.getProperties());
        return properties;
    }

    @Override
    protected int judgeAppPort(ShellVisitor visitor, Host host, Redis app) throws SampleException {
        String script = portScript(host);
        String strPort = visitor.perform(script);
        return Integer.valueOf(strPort.trim());
    }

    //判断redis端口的脚本
    private String portScript(Host host) {
        if(host.getType().startsWith("/device/host/windows")){
            // windows 实际执行的是 tasklist
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_redis_port.bat");
        }else {//treat as linux
            //当前这个做法代码简单，但受限于 redis没有配置密码访问cli
            return "redis-cli info | grep tcp_port | awk -F: '{print $2}'";
            //下面这个做法，即便设置了redis的密码，依然可以访问
            //return "ps aux | grep redis-server | grep -v grep | awk '{print $12} ' | awk -F: '{print $2}'";
        }
    }

    private String readConfigScript(Host host) {
        if(host.getType().startsWith("/device/host/windows")){
            return "redis-cli.exe info";
        }else {//treat as linux
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_redis_conf.sh");
        }
    }
}
