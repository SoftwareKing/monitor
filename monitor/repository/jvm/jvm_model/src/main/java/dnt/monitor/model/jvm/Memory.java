package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>JVM Memory</h1>
 *
 * 类似于Process的memory
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=Memory")
public class Memory extends Entry {
    private static final long serialVersionUID = 5979946492374519332L;
    //堆内存使用情况
    private MemoryUsage heapMemoryUsage;
    //非堆内存使用情况
    private MemoryUsage nonHeapMemoryUsage;
    //暂挂最终处理对象数量
    private int         objectPendingFinalizationCount;

    public MemoryUsage getHeapMemoryUsage() {
        return heapMemoryUsage;
    }

    public void setHeapMemoryUsage(MemoryUsage heapMemoryUsage) {
        this.heapMemoryUsage = heapMemoryUsage;
    }

    public MemoryUsage getNonHeapMemoryUsage() {
        return nonHeapMemoryUsage;
    }

    public void setNonHeapMemoryUsage(MemoryUsage nonHeapMemoryUsage) {
        this.nonHeapMemoryUsage = nonHeapMemoryUsage;
    }

    public int getObjectPendingFinalizationCount() {
        return objectPendingFinalizationCount;
    }

    public void setObjectPendingFinalizationCount(int objectPendingFinalizationCount) {
        this.objectPendingFinalizationCount = objectPendingFinalizationCount;
    }
}
