package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>JVM Threading</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=Threading")
public class Threading extends Entry {
    private static final long serialVersionUID = -9052731352255796295L;
    //CPU时间
    private long currentThreadCpuTime;
    //用户态CPU时间
    private long currentThreadUserTime;
    //当前总线程数
    private int  threadCount;
    //守护线程数
    private int  daemonThreadCount;
    //最高线程数
    private int  peakThreadCount;
    //总共启动过的线程数
    private long  totalStartedThreadCount;

    public long getCurrentThreadCpuTime() {
        return currentThreadCpuTime;
    }

    public void setCurrentThreadCpuTime(long currentThreadCpuTime) {
        this.currentThreadCpuTime = currentThreadCpuTime;
    }

    public long getCurrentThreadUserTime() {
        return currentThreadUserTime;
    }

    public void setCurrentThreadUserTime(long currentThreadUserTime) {
        this.currentThreadUserTime = currentThreadUserTime;
    }

    public int getThreadCount() {
        return threadCount;
    }

    public void setThreadCount(int threadCount) {
        this.threadCount = threadCount;
    }

    public int getDaemonThreadCount() {
        return daemonThreadCount;
    }

    public void setDaemonThreadCount(int daemonThreadCount) {
        this.daemonThreadCount = daemonThreadCount;
    }

    public int getPeakThreadCount() {
        return peakThreadCount;
    }

    public void setPeakThreadCount(int peakThreadCount) {
        this.peakThreadCount = peakThreadCount;
    }

    public long getTotalStartedThreadCount() {
        return totalStartedThreadCount;
    }

    public void setTotalStartedThreadCount(long totalStartedThreadCount) {
        this.totalStartedThreadCount = totalStartedThreadCount;
    }
}
