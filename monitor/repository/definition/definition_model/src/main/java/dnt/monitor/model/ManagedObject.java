/**
 * Developer: Kadvin Date: 14/12/25 上午11:29
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import dnt.monitor.util.MoIdResolver;
import net.happyonroad.model.PropertiesSupportRecord;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;

/**
 * <h1>可监控的对象</h1>
 * <ul>
 * <li>Resource -has many-> Components
 * <li>Resource(from) ->Link-> Resource(to)
 * </ul>
 * 限制约束如下：
 * <ul>
 * <li>Link不表达Component之间的连接，到Component通过Link的Properties标记
 * <li>不通过这里的类结构表达Component之间的包容关系，也是通过他们自身的Properties标记
 * </ul>
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
@JsonTypeIdResolver(MoIdResolver.class)
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class ManagedObject extends PropertiesSupportRecord implements Cloneable {
    private static final long serialVersionUID = 3096086440014616660L;
    // the type
    private String type;
    //用户设置的名称
    private String label;

    //////////////////////////////////////////////////
    // 以下三个状态并没有定义为 indicator/config/metric
    //   都应该基于一系列的算法计算出来
    //////////////////////////////////////////////////

    //性能状态: 与传统电信网管中的 usage state + alarm status 的作用类似
    // TMN里面
    //   usage state包括: Idle/Active/Busy
    //   alarm state包括: Under repair | Critical | Major | Minor | Alarm outstanding
    //  这个属性概念上是只读的，只能由被管对象自身表达
    private Performance  performance  = Performance.Unknown;
    //配置状态
    private ConfigStatus configStatus = ConfigStatus.Unknown;
    //可用性状态(又名通断状态)：与传统网管中的 operational state 的作用类似
    //  这个属性概念上是只读的，只能由被管对象自身表达
    //在TMN里面，实际的 Availability Status 包括：
    //  In test | Failed | Power off | Off line | Off duty
    //  Dependency | Degraded | Not installed | Log full
    //  不设置值，说明非以上任一状态
    private Availability availability = Availability.Unknown;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Performance getPerformance() {
        return performance;
    }

    public void setPerformance(Performance performance) {
        this.performance = performance;
    }

    public ConfigStatus getConfigStatus() {
        return configStatus;
    }

    public void setConfigStatus(ConfigStatus configStatus) {
        this.configStatus = configStatus;
    }

    public Availability getAvailability() {
        return availability;
    }

    public void setAvailability(Availability availability) {
        this.availability = availability;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + getLabel() + ')';
    }

}
