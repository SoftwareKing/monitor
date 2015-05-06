/**
 * Developer: Kadvin Date: 14/12/25 下午12:48
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.snmp.Transformer;
import dnt.monitor.handler.CPUTransformerHandler;

/**
 * <H1>主机的CPU</H1>
 * Host has many CPUs
 * <pre>
 * TODO CPU有1分钟/5分钟/15分钟三组指标，这个模型应该增强为支持三组指标
 * 将每个指标组变为一个Entry
 * 另外，SNMP也能支持采集CPU，但不同的os其oid可能并不一样
 * 这带来一个问题，@Table, @Group等SNMP的设置也会出现多os匹配问题
 * </pre>
 */
@Anchor("idx")
@Shell({
        //CPU     %user     %nice   %system   %iowait    %steal     %idle
        @OS(type = "linux",
                command = @Command("LANG=en_US sar -P ALL @args[0] @args[1] | grep Average | tail -n+2 @args[2]"),
                mapping = @Mapping({"","idx","usrUsage","nice","sysUsage","ioWait","","idle"})),
        @OS(type = "osx",
                command = @Command("LANG=en_US sar -u @args[0] @args[1] | grep Average @args[2]"),
                mapping = @Mapping({"", "usrUsage", "nice", "sysUsage", "idle"})),        
        @OS(type = "aix"  , 
                command = @Command("LANG=en_US @args[0]") ,
                mapping = @Mapping(value = {"idx","usrUsage","","sysUsage","ioWait","","idle"}) )
        
})
@Table(value = "1.3.6.1.2.1.25.3.3", prefix = "hr", timeout = "1m")
@Transformer(CPUTransformerHandler.class)
public class CPU extends Component<Host> {
    private static final long serialVersionUID = -968071692729621363L;
    //idx = "all" 为总体, 其次的CPU从0开始
    @Indicator
    private String idx = "all";//default
    @Config
    //如: Intel Core i7
    private String  modelName;
    @Config(unit = "GHz")
    private Float   frequency;

    // 以下均是 Unit为%的性能指标

    @Metric(unit = "%")
    @Value("100-idle")
    private Float usage;
    @Metric(unit = "%")
    private Float usrUsage;
    @Metric(unit = "%")
    private Float sysUsage;
    @Metric(unit = "%")
    private Float idle;
    @Metric(unit = "%")
    private Float ioWait;
    @Metric(unit = "%")
    private Float nice;


    public String getIdx() {
        return idx;
    }

    public void setIdx(String idx) {
        this.idx = idx;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public Float getFrequency() {
        return frequency;
    }

    public void setFrequency(Float frequency) {
        this.frequency = frequency;
    }

    public Float getUsage() {
        return usage;
    }

    public void setUsage(Float usage) {
        this.usage = usage;
    }

    public Float getUsrUsage() {
        return usrUsage;
    }

    public void setUsrUsage(Float usrUsage) {
        this.usrUsage = usrUsage;
    }

    public Float getSysUsage() {
        return sysUsage;
    }

    public void setSysUsage(Float sysUsage) {
        this.sysUsage = sysUsage;
    }

    public Float getIdle() {
        if(idle==null && usage!=null){
            return 100 - usage;
        }
        return idle;
    }

    public void setIdle(Float idle) {
        this.idle = idle;
    }

    public Float getIoWait() {
        return ioWait;
    }

    public void setIoWait(Float ioWait) {
        this.ioWait = ioWait;
    }

    public Float getNice() {
        return nice;
    }

    public void setNice(Float nice) {
        this.nice = nice;
    }

    @Override
    public String toString() {
        return "CPU(" + getIdx() + ")";
    }
}
