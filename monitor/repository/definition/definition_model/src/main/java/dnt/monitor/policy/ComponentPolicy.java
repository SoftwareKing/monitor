package dnt.monitor.policy;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import net.happyonroad.model.PropertiesSupportRecord;
import net.happyonroad.type.State;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.CglibCompactClassNameIdResolver;

import java.io.Serializable;

/**
 * <h1>资源策略中，针对特定组件的策略</h1>
 *
 * @author Jay Xiong
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
@JsonTypeIdResolver(CglibCompactClassNameIdResolver.class)
public class ComponentPolicy extends PropertiesSupportRecord implements Serializable{
    private static final long serialVersionUID = -1680761296315656739L;

    private Long resourcePolicyId;

    ////////////////////////////////////////////////////////////////
    // 基本信息
    ////////////////////////////////////////////////////////////////

    //这个组件策略对应的组件在资源中的字段名称
    private String fieldName;

    //这个组件策略对组件实例的选择/过滤条件
    private String criteria;

    ////////////////////////////////////////////////////////////////
    // 策略内容
    ////////////////////////////////////////////////////////////////

    //监控频度， override ManagedNode#frequency
    // 30s
    private TimeInterval frequency;
    //是否监控， override ManagedNode#state
    private State state;
    //是否关键
    private boolean keyed;// 这不是针对某个组件，而是说符合条件的组件就是这样了

    ////////////////////////////////////////////////////////////////
    // 指标定义
    ////////////////////////////////////////////////////////////////

    // 组件的指标定义，主要定义了:
    //   是否关键
    //   红黄阈值与发生次数
    // 以上的定义，默认策略来源于元模型; 其他策略override元模型上相应的信息
    private MetricPolicy[] metrics;

    // 组件的配置指标策略，主要定义了:
    //  是否关键
    private ConfigPolicy[] configs;

    public Long getResourcePolicyId() {
        return resourcePolicyId;
    }

    public void setResourcePolicyId(Long resourcePolicyId) {
        this.resourcePolicyId = resourcePolicyId;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getCriteria() {
        return criteria;
    }

    public void setCriteria(String criteria) {
        this.criteria = criteria;
    }

    public TimeInterval getFrequency() {
        return frequency;
    }

    public void setFrequency(TimeInterval frequency) {
        this.frequency = frequency;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public boolean isKeyed() {
        return keyed;
    }

    public void setKeyed(boolean keyed) {
        this.keyed = keyed;
    }

    public MetricPolicy[] getMetrics() {
        return metrics;
    }

    public void setMetrics(MetricPolicy[] metrics) {
        this.metrics = metrics;
    }

    public ConfigPolicy[] getConfigs() {
        return configs;
    }

    public void setConfigs(ConfigPolicy[] configs) {
        this.configs = configs;
    }
}
