package dnt.monitor.model.jvm;

import java.io.Serializable;

/**
 * <h1>Memory Usage</h1>
 *
 * @author Jay Xiong
 */
public class MemoryUsage implements Serializable{
    private static final long serialVersionUID = 7630607852131550664L;

    //提交的内存
    private long committed;
    //内存初始大小
    private long init;
    //内存最大大小
    private long max;
    //内存已使用大小
    private long used;

    public long getCommitted() {
        return committed;
    }

    public void setCommitted(long committed) {
        this.committed = committed;
    }

    public long getInit() {
        return init;
    }

    public void setInit(long init) {
        this.init = init;
    }

    public long getMax() {
        return max;
    }

    public void setMax(long max) {
        this.max = max;
    }

    public long getUsed() {
        return used;
    }

    public void setUsed(long used) {
        this.used = used;
    }
}
