/**
 * Developer: Kadvin Date: 14/12/25 下午12:50
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.snmp.Transformer;
import dnt.monitor.handler.MemoryTransformerHandler;

/**
 * <h1>内存</h1>
 * Host has one Memory
 * 这里这个Memory不是指某个实际的内存条，而是一个主机的内存总体对象
 */
@Anchor(value = "", connector = "") // Anchor == "Memory"
@Shell({
        @OS(type = "linux",
                command = @Command("free -m | awk '{if(NR==2||NR==4){printf $2 \" \" $3 \" \" $4 \" \";}}'"),
                mapping = @Mapping({"total", "used", "free", "virtualTotal", "virtualUsed", "virtualFree"})),
        @OS(type = "aix"  , 
                command = @Command("x=`vmstat -v|egrep 'memory pages|free pages'|awk '{printf \"%d\\n\", $1*4/1024}'|sed 'N;s/\\n/ /'|" +
                "awk '{print $1,$1-$2,$2}';swap -s |awk '{printf \"%d,%d\",$3*4/1024,$11*4/1024}'|awk -F, '{print $1,$1-$2,$2}'`;echo $x"))
        
})
@Mapping({"total","used","free","virtualTotal","virtualUsed","virtualFree"})
@Table(value = "1.3.6.1.2.1.25.2.3",prefix = "hr", timeout = "1m")
@Transformer(MemoryTransformerHandler.class)
public class Memory extends Component<Host> {
    private static final long serialVersionUID = -4917021969415343522L;
    @Config(unit = "MB")
    private Integer total;
    @Metric(unit = "MB")
    private Integer used;
    @Metric(unit = "MB")
    private Integer free;
    @Metric(unit = "%")
    @Value("used/total")
    private Float   usage;

    @Config(unit = "MB")
    private Integer virtualTotal;
    @Metric(unit = "MB")
    private Integer virtualUsed;
    @Metric(unit = "MB")
    private Integer virtualFree;
    @Metric(unit = "%")
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
