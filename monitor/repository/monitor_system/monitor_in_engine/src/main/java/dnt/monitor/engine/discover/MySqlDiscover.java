package dnt.monitor.engine.discover;

import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.model.Host;
import dnt.monitor.model.MySql;
import dnt.monitor.model.Process;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.StringUtils;
import org.ini4j.Ini;
import org.ini4j.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringReader;
import java.util.*;

/**
 * <h1>发现主机上的MySQL应用</h1>
 * 基于实际进程进行发现，其实还有
 * <ul>
 * <li>基于服务(chkconfig --list) 可以发现未被启动的mysql服务，但也会发现配置错误的无效mysql
 * <li>基于端口(tcp:3306)， 有缺陷，无法发现修改过的端口，无法发现以domain socket方式提供服务的端口
 * <li>基于socket文件(mysql.sock)，与基于端口类似，另外，在各个os上面，配置的mysql.sock路径也不太一样
 * </ul>
 *
 * @author Jay Xiong
 */
@Component
class MySqlDiscover extends DiscoverByProcess<MySql> {

    protected String filterScript(Host host) {
        if (host.getType().startsWith("/device/host/windows")) {
            // windows 实际执行的是 tasklist
            return "| findstr mysqld.exe";
        } else {//treat as linux
            return "| grep mysqld | grep -v mysqld_safe | grep -v grep";
        }
    }

    protected MySql createResource(List<Process> processes) {
        MySql mySql = new MySql();
        mySql.setType("/app/db/mysql");
        Set<Integer> pids = new HashSet<Integer>();
        for (Process process : processes) {
            pids.add(process.getPid());
        }
        mySql.setPids(pids);
        mySql.setAvailability(Availability.Available);
        mySql.setConfigStatus(ConfigStatus.Unchanged);
        mySql.setPerformance(Performance.Normal);
        return mySql;
    }

    @Override
    protected String judgeAppHome(ShellVisitor visitor, Host host, MySql mySql) throws SampleException {
        String baseScript = readDataDirScript(host);
        //由于 data_dir 参数有默认策略，所以，根据命令行实际情况来读取是比较靠谱的
        return visitor.perform(baseScript);
    }

    @Override
    protected Properties readAppProperties(ShellVisitor visitor, Host host, MySql mysql) throws SampleException {
        Properties properties = new Properties();
        String mysqlConfig;
        String initScript = readIniScript(host);
        mysqlConfig = visitor.perform(initScript);
        if (StringUtils.isNotBlank(mysqlConfig)) {
            StringReader reader = new StringReader(mysqlConfig);
            Ini ini;
            try {
                ini = new Ini(reader);
                for(Profile.Section section : ini.values()){
                    for (Map.Entry<String, String> entry : section.entrySet()) {
                        properties.setProperty(section.getName() + "." + entry.getKey(), entry.getValue());
                    }
                }
            } catch (IOException e) {
                throw new SampleException("Can't read mysql config file");
            }
        }
        return properties;
    }

    @Override
    protected int judgeAppPort(ShellVisitor visitor, Host host, MySql mysql) throws SampleException {
        return Integer.valueOf(mysql.getProperty("mysqld.port", "3306"));
    }

    private String readDataDirScript(Host host) {
        if(host.getType().startsWith("/device/host/windows")){
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_mysql_data_dir.bat");
        }else {//treat as linux
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_mysql_data_dir.sh");
        }
    }

    private String readIniScript(Host host) {
        if(host.getType().startsWith("/device/host/windows")){
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_my_ini.bat");
        }else {//treat as linux
            return MiscUtils.actualContent(MySqlDiscover.class, "classpath:./read_my_cnf.sh");
        }
    }
}
