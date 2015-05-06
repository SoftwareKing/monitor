package dnt.monitor.engine.discover;

import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.model.Host;
import dnt.monitor.model.Nginx;
import dnt.monitor.model.Process;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.stereotype.Component;

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
class NginxDiscover extends DiscoverByProcess<Nginx> {

    protected String filterScript(Host host) {
        if (host.getType().startsWith("/device/host/windows")) {
            // windows 实际执行的是 tasklist
            return "| findstr nginx.exe";
        } else {//treat as linux
            return "| grep nginx | grep -v grep";
        }
    }

    protected Nginx createResource(List<Process> processes) {
        Nginx nginx = new Nginx();
        nginx.setType("/app/nginx");
        Set<Integer> pids = new HashSet<Integer>();
        for (Process process : processes) {
            pids.add(process.getPid());
        }
        nginx.setPids(pids);
        nginx.setAvailability(Availability.Available);
        nginx.setConfigStatus(ConfigStatus.Unchanged);
        nginx.setPerformance(Performance.Normal);
        return nginx;
    }

    @Override
    protected String judgeAppHome(ShellVisitor visitor, Host host, Nginx nginx) throws SampleException {
        return visitor.perform("dirname `which nginx`");
    }

    @Override
    protected Properties readAppProperties(ShellVisitor visitor, Host host, Nginx nginx) throws SampleException {
        return null;
    }

    @Override
    protected int judgeAppPort(ShellVisitor visitor, Host host, Nginx app) throws SampleException {
        String script = portScript(host);
        String strPort = visitor.perform(DateUtils.MILLIS_PER_MINUTE, script);
        return Integer.valueOf(strPort.trim());
    }

    //判断redis端口的脚本
    String portScript(Host host) {
        if (host.getType().startsWith("/device/host/windows")) {
            // windows 实际执行的是 tasklist
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_nginx_port.bat");
        } else if (host.getType().startsWith("/device/host/linux")) {
            return "netstat -anp --tcp | grep LISTEN | grep nginx | head -1 | awk '{print $4}' | awk -F: '{print $2}'";
        } else {//osx not support
            return "sudo lsof -Pnl +M -i4tcp | grep nginx | head -1 | awk '{print $9}' | awk -F: '{print $2}'";
        }
    }

    String readConfigScript(Host host) {
        if (host.getType().startsWith("/device/host/windows")) {
            return "nginx -t ";
        } else {//treat as linux
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_nginx_conf.sh");
        }
    }
}
