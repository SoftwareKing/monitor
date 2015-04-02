/**
 * Developer: Kadvin Date: 14/12/23 下午4:17
 */
package dnt.monitor.model;

import dnt.monitor.annotation.*;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import dnt.monitor.annotation.ssh.Value;
import net.happyonroad.model.Credential;
import java.util.Date;
import java.util.List;

/**
 * 主机资源
 */
@Category(value = "host", credentials = Credential.Snmp)
@Command("uname -nro")
@Mapping({"hostname","version","os"})
public class Host extends Device {
    private static final long serialVersionUID = 611137932541289802L;
    @Config
    //内部配置的主机名
    private String  hostname;
    @Config
    //所属域(Windows特别有用)
    private String  domain;
    @Config
    private String  manufacturer;
    @Config
    private String  modelName;
    @Config
    private String  os;
    @Config
    private String  version;
    @Config
    private String  serialNumber;
    @Indicator //什么时候启动的
    @Command("echo $((`date +%s`-`cat /proc/uptime | awk '{split($1,a,\".\");print a[1];}'`))")
    @Value(converter = "secondToDate")
    private Date    startAt;
    @Indicator //该主机当前的时间
    @Command("date +%s")
    @Value(converter = "secondToDate")
    private Date    localTime;
    @Config(unit = "个")
    @Command("cat /proc/cpuinfo |grep \"processor\"|sort -u|wc -l")
    private Integer cpuCount;
    @Metric(unit = "个")
    @Command("ps -e | wc -l")
    private Integer processCount;

    ////////////////////////////////////////////////
    // 组件与关系
    ////////////////////////////////////////////////

    //CPU 总体信息 (index = 0)
    @Depends("CPUs")
    private CPU             CPU;
    // CPUs (index > 0)
    private List<CPU>       CPUs;
    // Memory
    private Memory          memory;
    // Disks
    private List<Disk>      disks;
    // Partitions
    private List<Partition> partitions;
    // Processes
    private List<Process>   processes;

    public Host() {
        setType("/device/host");
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Date getStartAt() {
        return startAt;
    }

    public void setStartAt(Date startAt) {
        this.startAt = startAt;
    }

    public Date getLocalTime() {
        return localTime;
    }

    public void setLocalTime(Date localTime) {
        this.localTime = localTime;
    }

    public Integer getCpuCount() {
        return cpuCount;
    }

    public void setCpuCount(Integer cpuCount) {
        this.cpuCount = cpuCount;
    }

    public Integer getProcessCount() {
        return processCount;
    }

    public void setProcessCount(Integer processCount) {
        this.processCount = processCount;
    }

    public CPU getCPU() {
        return CPU;
    }

    public void setCPU(CPU CPU) {
        this.CPU = CPU;
    }

    public List<CPU> getCPUs() {
        return CPUs;
    }

    public void setCPUs(List<CPU> CPUs) {
        this.CPUs = CPUs;
        if(CPUs!=null && CPUs.size()>0) {
            CPU totalCPU = new CPU();
            totalCPU.setIdx(0);
            float usage = 0;
            float usrUsage = 0;
            float sysUsage = 0;
            float idle = 0;
            float ioWait = 0;
            for (CPU cpu:CPUs){
                usage += cpu.getUsage()==null?0:cpu.getUsage();
                usrUsage += cpu.getUsrUsage()==null?0:cpu.getUsrUsage();
                sysUsage += cpu.getSysUsage()==null?0:cpu.getSysUsage();
                idle += cpu.getIdle()==null?0:cpu.getIdle();
                ioWait += cpu.getIoWait()==null?0:cpu.getIoWait();
            }
            totalCPU.setUsage(usage/CPUs.size());
            totalCPU.setUsrUsage(usrUsage/CPUs.size());
            totalCPU.setSysUsage(sysUsage/CPUs.size());
            totalCPU.setIdle(idle/CPUs.size());
            totalCPU.setIoWait(ioWait/CPUs.size());
            setCPU(totalCPU);
        }
    }

    public Memory getMemory() {
        return memory;
    }

    public void setMemory(Memory memory) {
        this.memory = memory;
    }

    public List<Disk> getDisks() {
        return disks;
    }

    public void setDisks(List<Disk> disks) {
        this.disks = disks;
    }

    public List<Partition> getPartitions() {
        return partitions;
    }

    public void setPartitions(List<Partition> partitions) {
        this.partitions = partitions;
    }

    public List<Process> getProcesses() {
        return processes;
    }

    public void setProcesses(List<Process> processes) {
        this.processes = processes;
    }

}
