/**
 * Developer: Kadvin Date: 14/12/25 下午3:47
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.snmp.Transformer;
import dnt.monitor.handler.ProcessTransformerHandler;

/**
 * <h1>主机进程</h1>
 * Host -has many-> Processes
 * <p/>
 * 备注： 进程这个组件未必在每次采集/同步的时候，要存入
 * 或者，仅有设定了监控指标的进程，或者需要做报表的，才需要同步入数据库
 * 同理可知，其他的组件也未必非要入数据库的
 */
@Anchor("pid")
@Shell({
        //注意，原则上，如果不需要命令行输出的表头，则不应该使用skip lines特性，而是让命令直接grep -v掉 头
        @OS(type = "linux", command = @Command("ps -eo fname,user,pid,ppid,pcpu,size,vsize,state,lstart,etime,cmd | grep -v ^COMMAND @args[0]"),
                mapping = @Mapping(
                        //COMMAND  USER       PID  PPID %CPU    SZ    VSZ S                  STARTED     ELAPSED CMD
                        //init     root         1     0  0.0   288  19232 S Mon Apr 20 19:52:24 2015  1-22:37:49 /sbin/init
                        pattern = "(\\S+)\\s+(\\S+)\\s+(\\d+)\\s+(\\d+)\\s+([\\d|\\.]+)\\s+(\\d+)\\s+(\\d+)" +
                                  "\\s+(\\w+)\\s+(.{24})\\s+(\\S+)\\s+(.+)",
                        value = {"fname", "user", "pid", "ppid", "cpuUsage", "physicalMemory", "virtualMemory",
                                 "status", "startTime", "time","command"})),
        @OS(type = "aix", command = @Command("ps -e -o 'comm,user,pid,ppid,pcpu,rssize,vsz,state,etime,args' | tail -n +2 "),
                mapping = @Mapping(
                        pattern = "(\\S+)\\s+(\\S+)\\s+(\\d+)\\s+(\\d+)\\s+([\\d|\\.]+)\\s+(\\d+)\\s+(\\d+)\\s+(\\w+)\\s+(\\S+)\\s+(.+)",
                        value = {"fname", "user", "pid", "ppid", "cpuUsage", "physicalMemory", "virtualMemory",
                                "status", "time","command"})),

        @OS(type = "osx", command = @Command("ps -lcfwax | grep -v ^UID @args[0]"),
                //UID   PID  PPID        F CPU PRI NI       SZ    RSS WCHAN     S             ADDR TTY           TIME CMD   STIME
                //501 11137 11136     4006   0  31  0  2464092    944 -      S                   0 ttys000    0:00.16 -bash Mon02PM
                mapping = @Mapping(
                        value = {"user", "pid", "ppid", "flags", "cpuUsage", "priority", "nice",
                                 "physicalMemory", "virtualMemory", "wchan","status", "addr", "tty", "time", "command", "startTime"}))
})
@dnt.monitor.annotation.snmp.OS(
        tables = {
                @Table(value = "1.3.6.1.2.1.25.4.2", prefix = "hr", timeout = "1m", name = "main"),
                @Table(value = "1.3.6.1.2.1.25.5.1", prefix = "hr", timeout = "1m", name = "performance")
        },
        transformer = @Transformer(ProcessTransformerHandler.class)
)
public class Process extends Component<Host> {
    private static final long serialVersionUID = 7524270593767846009L;

    @Indicator
    @Override
    @Shell(@OS(type = "linux", value = @Value("fname")))
    public String getLabel() {
        return super.getLabel();
    }
    @Indicator
    private String user;
    @Indicator
    private Integer pid;
    @Indicator
    private Integer ppid;
    @Metric
    private Integer handles;
    @Indicator
    private String  startTime;
    @Indicator
    private String  time;
    @Metric(unit = "KB")
    private Long    physicalMemory;
    @Metric
    private Long    virtualMemory;
    @Indicator
    private String  command;
    @Metric
    private Float   cpuUsage;
    @Metric   // enum
    private String  status;

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public Integer getPpid() {
        return ppid;
    }

    public void setPpid(Integer ppid) {
        this.ppid = ppid;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Integer getHandles() {
        return handles;
    }

    public void setHandles(Integer handles) {
        this.handles = handles;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Long getPhysicalMemory() {
        return physicalMemory;
    }

    public void setPhysicalMemory(Long physicalMemory) {
        this.physicalMemory = physicalMemory;
    }

    public Long getVirtualMemory() {
        return virtualMemory;
    }

    public void setVirtualMemory(Long virtualMemory) {
        this.virtualMemory = virtualMemory;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public Float getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(Float cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
