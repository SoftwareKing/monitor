package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>垃圾回收结构体</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=GarbageCollector")
public class GarbageCollector extends Entry{
    private static final long serialVersionUID = -1189594476326791033L;

    private String name;
    private long collectionCount;
    private long collectionTime;
    private String[] memoryPoolNames;
    private boolean valid;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCollectionCount() {
        return collectionCount;
    }

    public void setCollectionCount(long collectionCount) {
        this.collectionCount = collectionCount;
    }

    public long getCollectionTime() {
        return collectionTime;
    }

    public void setCollectionTime(long collectionTime) {
        this.collectionTime = collectionTime;
    }

    public String[] getMemoryPoolNames() {
        return memoryPoolNames;
    }

    public void setMemoryPoolNames(String[] memoryPoolNames) {
        this.memoryPoolNames = memoryPoolNames;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
