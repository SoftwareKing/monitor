/**
 * Developer: Kadvin Date: 14/12/25 下午3:47
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import dnt.monitor.annotation.ssh.Value;

/**
 * <h1>主机进程</h1>
 * Host -has many-> Processes
 *
 * 备注： 进程这个组件未必在每次采集/同步的时候，要存入
 * 或者，仅有设定了监控指标的进程，或者需要做报表的，才需要同步入数据库
 * 同理可知，其他的组件也未必非要入数据库的
 */
@Anchor("pid")
@Command("ps -eo fname,user,pid,ppid,pcpu,size,vsize,state,lstart,etime,cmd")
@Mapping(skipLines = 1,value = {"fname","user","pid","ppid","cpuUsage","physicalMemory","virtualMemory","status","startTime1","startTime2","startTime3","startTime4","startTime5","time","command"})
public class Process extends Component<Host> {
    private static final long serialVersionUID = 7524270593767846009L;

    @Indicator
    @Override
    @Value("fname")
    public String getLabel() {
        return super.getLabel();
    }

    @Indicator
    private Integer pid;
    @Indicator
    private Integer ppid;
    @Metric
    private Integer handles;
    @Indicator
    @Value("startTime1+startTime2+startTime3+startTime4+startTime5")
    private String startTime;
    @Indicator
    private String time;
    @Metric
    private Long physicalMemory;
    @Metric
    private Long virtualMemory;
    @Indicator
    private String command;
    @Metric
    private Float cpuUsage;
    @Metric   // enum
    private String status;

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
