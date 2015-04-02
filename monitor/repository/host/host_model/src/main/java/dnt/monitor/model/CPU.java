/**
 * Developer: Kadvin Date: 14/12/25 下午12:48
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.ssh.*;

/**
 * <H1>主机的CPU</H1>
 * Host has many CPUs
 */
@Anchor("idx")
@Command("sar -P ALL 1 2 | grep Average | grep -v all")
@Mapping(value = {"","idx","usrUsage","","sysUsage","ioWait","","idle"},skipLines = 1)
public class CPU extends Component<Host> {
    private static final long serialVersionUID = -968071692729621363L;
    //index = 0 为总体, 其次的CPU从1开始
    //  当主机只有一个CPU时 cpu[0] == cpu[1]
    @Indicator
    private Integer idx;
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


    public Integer getIdx() {
        return idx;
    }

    public void setIdx(Integer idx) {
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
}
