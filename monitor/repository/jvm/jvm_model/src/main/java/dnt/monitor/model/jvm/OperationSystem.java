package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>操作系统数据结构</h1>
 *
 * 与host类似，但作为JVM应用的一个数据结构
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=OperatingSystem")
public class OperationSystem extends Entry {

    private static final long serialVersionUID = 3429274551606317364L;

    //操作系统
    private String name;
    //操作系统版本
    private String version;
    //体系结构
    private String arch;
    //CPU个数
    private int availableProcessors;
    //提交的虚拟内存
    private long committedVirtualMemorySize;
    //总物理内存
    private long totalPhysicalMemorySize;
    //空闲物理内存
    private long freePhysicalMemorySize;
    //总交换空间
    private long totalSwapSpaceSize;
    //空闲交换空间
    private long freeSwapSpaceSize;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getArch() {
        return arch;
    }

    public void setArch(String arch) {
        this.arch = arch;
    }

    public int getAvailableProcessors() {
        return availableProcessors;
    }

    public void setAvailableProcessors(int availableProcessors) {
        this.availableProcessors = availableProcessors;
    }

    public long getCommittedVirtualMemorySize() {
        return committedVirtualMemorySize;
    }

    public void setCommittedVirtualMemorySize(long committedVirtualMemorySize) {
        this.committedVirtualMemorySize = committedVirtualMemorySize;
    }

    public long getTotalPhysicalMemorySize() {
        return totalPhysicalMemorySize;
    }

    public void setTotalPhysicalMemorySize(long totalPhysicalMemorySize) {
        this.totalPhysicalMemorySize = totalPhysicalMemorySize;
    }

    public long getFreePhysicalMemorySize() {
        return freePhysicalMemorySize;
    }

    public void setFreePhysicalMemorySize(long freePhysicalMemorySize) {
        this.freePhysicalMemorySize = freePhysicalMemorySize;
    }

    public long getTotalSwapSpaceSize() {
        return totalSwapSpaceSize;
    }

    public void setTotalSwapSpaceSize(long totalSwapSpaceSize) {
        this.totalSwapSpaceSize = totalSwapSpaceSize;
    }

    public long getFreeSwapSpaceSize() {
        return freeSwapSpaceSize;
    }

    public void setFreeSwapSpaceSize(long freeSwapSpaceSize) {
        this.freeSwapSpaceSize = freeSwapSpaceSize;
    }
}
