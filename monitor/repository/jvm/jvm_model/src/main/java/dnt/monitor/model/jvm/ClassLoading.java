package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>JVM ClassLoading</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=ClassLoading")
public class ClassLoading extends Entry {
    private static final long serialVersionUID = 2287890990714824717L;

    private long loadedClassCount;
    private long totalLoadedClassCount;
    private long unloadedClassCount;

    public long getLoadedClassCount() {
        return loadedClassCount;
    }

    public void setLoadedClassCount(long loadedClassCount) {
        this.loadedClassCount = loadedClassCount;
    }

    public long getTotalLoadedClassCount() {
        return totalLoadedClassCount;
    }

    public void setTotalLoadedClassCount(long totalLoadedClassCount) {
        this.totalLoadedClassCount = totalLoadedClassCount;
    }

    public long getUnloadedClassCount() {
        return unloadedClassCount;
    }

    public void setUnloadedClassCount(long unloadedClassCount) {
        this.unloadedClassCount = unloadedClassCount;
    }
}
