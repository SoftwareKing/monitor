/**
 * Developer: Kadvin Date: 14/12/25 下午12:50
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import dnt.monitor.annotation.ssh.Value;

/**
 * <h1>内存</h1>
 * Host has one Memory
 * 这里这个Memory不是指某个实际的内存条，而是一个主机的内存总体对象
 */
@Anchor(value = "", connector = "") // Anchor == "Memory"
@Command("free -m | awk '{if(NR==2||NR==4){printf $2 \" \" $3 \" \" $4 \" \";}}'")
@Mapping({"total","used","free","virtualTotal","virtualUsed","virtualFree"})
public class Memory extends Component<Host> {
    private static final long serialVersionUID = -4917021969415343522L;
    @Config
    private Integer total;
    @Metric
    private Integer used;
    @Metric
    private Integer free;
    @Metric
    @Value("used/total")
    private Float   usage;

    @Config
    private Integer virtualTotal;
    @Metric
    private Integer virtualUsed;
    @Metric
    private Integer virtualFree;
    @Metric
    @Value("virtualUsed/virtualTotal")
    private Float   virtualUsage;

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getUsed() {
        return used;
    }

    public void setUsed(Integer used) {
        this.used = used;
    }

    public Integer getFree() {
        return free;
    }

    public void setFree(Integer free) {
        this.free = free;
    }

    public Float getUsage() {
        return usage;
    }

    public void setUsage(Float usage) {
        this.usage = usage;
    }

    public Integer getVirtualTotal() {
        return virtualTotal;
    }

    public void setVirtualTotal(Integer virtualTotal) {
        this.virtualTotal = virtualTotal;
    }

    public Integer getVirtualUsed() {
        return virtualUsed;
    }

    public void setVirtualUsed(Integer virtualUsed) {
        this.virtualUsed = virtualUsed;
    }

    public Integer getVirtualFree() {
        return virtualFree;
    }

    public void setVirtualFree(Integer virtualFree) {
        this.virtualFree = virtualFree;
    }

    public Float getVirtualUsage() {
        return virtualUsage;
    }

    public void setVirtualUsage(Float virtualUsage) {
        this.virtualUsage = virtualUsage;
    }
}
