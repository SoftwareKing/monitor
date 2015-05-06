package dnt.monitor.model.engine;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>监控引擎的监控统计信息</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("dnt.monitor.engine:type=service,name=monitoringService")
public class MonitoringStats extends Entry{
    private static final long serialVersionUID = 6383405113146440001L;

    private long poolSize, corePoolSize, maxPoolSize, largestPoolSize, activeThreadCount, completedTaskCount;

    public long getPoolSize() {
        return poolSize;
    }

    public void setPoolSize(long poolSize) {
        this.poolSize = poolSize;
    }

    public long getCorePoolSize() {
        return corePoolSize;
    }

    public void setCorePoolSize(long corePoolSize) {
        this.corePoolSize = corePoolSize;
    }

    public long getMaxPoolSize() {
        return maxPoolSize;
    }

    public void setMaxPoolSize(long maxPoolSize) {
        this.maxPoolSize = maxPoolSize;
    }

    public long getLargestPoolSize() {
        return largestPoolSize;
    }

    public void setLargestPoolSize(long largestPoolSize) {
        this.largestPoolSize = largestPoolSize;
    }

    public long getActiveThreadCount() {
        return activeThreadCount;
    }

    public void setActiveThreadCount(long activeThreadCount) {
        this.activeThreadCount = activeThreadCount;
    }

    public long getCompletedTaskCount() {
        return completedTaskCount;
    }

    public void setCompletedTaskCount(long completedTaskCount) {
        this.completedTaskCount = completedTaskCount;
    }
}
