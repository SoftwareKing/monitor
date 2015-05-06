package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>Memory Pool</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=MemoryPool")
public class MemoryPool extends Entry {
    private static final long serialVersionUID = 4009729067889064972L;
    //名称
    private String name;
    //峰值使用情况
    private MemoryUsage peakUsage;
    //使用情况
    private MemoryUsage usage;
    //集合使用情况
    private MemoryUsage collectionUsage;
    //类型
    private String type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MemoryUsage getPeakUsage() {
        return peakUsage;
    }

    public void setPeakUsage(MemoryUsage peakUsage) {
        this.peakUsage = peakUsage;
    }

    public MemoryUsage getUsage() {
        return usage;
    }

    public void setUsage(MemoryUsage usage) {
        this.usage = usage;
    }

    public MemoryUsage getCollectionUsage() {
        return collectionUsage;
    }

    public void setCollectionUsage(MemoryUsage collectionUsage) {
        this.collectionUsage = collectionUsage;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
