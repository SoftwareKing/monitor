package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>JVM Compilation</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=Compilation")
public class Compilation extends Entry {
    private static final long serialVersionUID = 5250759426451178533L;

    private String name;
    private long totalCompilationTime;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getTotalCompilationTime() {
        return totalCompilationTime;
    }

    public void setTotalCompilationTime(long totalCompilationTime) {
        this.totalCompilationTime = totalCompilationTime;
    }
}
