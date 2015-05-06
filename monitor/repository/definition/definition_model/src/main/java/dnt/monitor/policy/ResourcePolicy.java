package dnt.monitor.policy;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.model.Category;
import net.happyonroad.model.PropertiesSupportRecord;
import net.happyonroad.type.Priority;
import net.happyonroad.util.CglibCompactClassNameIdResolver;
import org.springframework.expression.EvaluationException;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.ParseException;
import org.springframework.expression.spel.standard.SpelExpressionParser;

/**
 * <h1>针对特定资源模型的策略</h1>
 *
 * @author Jay Xiong
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
@JsonTypeIdResolver(CglibCompactClassNameIdResolver.class)
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class ResourcePolicy extends PropertiesSupportRecord implements Comparable<ResourcePolicy>{

    private static final long serialVersionUID = 5681904332620751247L;

    ////////////////////////////////////////////////////////////////
    // 基本信息
    ////////////////////////////////////////////////////////////////

    // 显示名称，如默认策略
    private String   label;
    // 优先级，当多个policy命中同一个资源时，资源根据该优先级决定遵从哪个策略
    private Priority priority;
    // 本策略是否生效,不是指被应用的资源是否监控
    private boolean  enabled;

    ////////////////////////////////////////////////////////////////
    // 资源定义
    ////////////////////////////////////////////////////////////////

    // 本策略对应的资源模型(type)
    private String resourceType;
    // 资源选择条件
    private String criteria;

    ////////////////////////////////////////////////////////////////
    // 指标定义：定义资源的各个配置指标的关键与否/性能指标的红黄阈值
    ////////////////////////////////////////////////////////////////

    // 资源的性能指标策略，主要定义了:
    //   是否关键
    //   红黄阈值与发生次数
    // 以上的定义，默认策略来源于元模型; 其他策略override元模型上相应的信息
    private MetricPolicy[] metrics;

    // 资源的配置指标策略，主要定义了:
    //  是否关键
    private ConfigPolicy[] configs;

    // 资源的组件定义，主要定义
    //   是否监控
    //   监控频度
    //   是否关键
    // 以上
    //   是否监控 与资源的管理信息(ResourceNode)上的state起到的作用一样，是提供更细粒度控制的落实点
    //   监控频度 与资源的管理信息(ResourceNode)上的frequency起到的作用一样，是提供更细粒度控制的落实点
    //
    private ComponentPolicy[] components;


    ////////////////////////////////////////////////////////////////
    // 告警定义: 定义哪些内部事件应该被转换为告警，从监控引擎向监控服务器发送；
    //  包括对内部事件的普通映射和组合两种方式
    ////////////////////////////////////////////////////////////////

    // 由事件通过映射定义出来的告警信息包括:
    //   事件标记
    //   是否产生
    //   级别(不是事件的级别)
    //   优先级(紧急程度)
    //   告警名称(普通映射出来的告警，其名称与事件名称一致)
    //   告警描述(普通映射出来的告警，其描述与事件描述一致)
    // 由事件组合出来的告警(又名自定义告警，组合告警)信息包括:
    //   事件组成
    //   相邻时间
    private AlarmPolicy[] alarms;

    ////////////////////////////////////////////////////////////////
    // 通知定义: 定义哪些告警应该发出通知，在什么事件段，通知给什么人，以及各种通知控制参数
    //  包括普通通知规则和通知升级规则
    //  通知升级，并不是对告警进行升级，而是对通知对象进行升级，可能
    //  包括对优先级，紧急程度的调整；标题，内容的调整，手段的调整等
    ////////////////////////////////////////////////////////////////

    //
    private NotificationPolicy[] notifications;

    ////////////////////////////////////////////////////////////////
    // 动作定义: 也是基于告警，其实通知就是一种系统内置的动作
    ////////////////////////////////////////////////////////////////

    private ActionPolicy[] actions;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getCriteria() {
        return criteria;
    }

    public void setCriteria(String criteria) {
        this.criteria = criteria;
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

    public ComponentPolicy[] getComponents() {
        return components;
    }

    public void setComponents(ComponentPolicy[] components) {
        this.components = components;
    }

    public AlarmPolicy[] getAlarms() {
        return alarms;
    }

    public void setAlarms(AlarmPolicy[] alarms) {
        this.alarms = alarms;
    }

    public NotificationPolicy[] getNotifications() {
        return notifications;
    }

    public void setNotifications(NotificationPolicy[] notifications) {
        this.notifications = notifications;
    }

    public ActionPolicy[] getActions() {
        return actions;
    }

    public void setActions(ActionPolicy[] actions) {
        this.actions = actions;
    }

    @Override
    public String toString() {
        return "ResourcePolicy("+ label + ')';
    }

    @Override
    public int compareTo(@SuppressWarnings("NullableProblems") ResourcePolicy another) {
        //先比较对应的类型匹配程度（也就是 resource type的深度，越深越匹配)
        //在类型匹配程度一样的情况下，再来比较优先级
        int depth = Category.depth(this.resourceType);
        int anotherDepth = Category.depth(another.resourceType);
        if( depth == anotherDepth )
            return this.priority.getValue() - another.priority.getValue();
        else{
            return depth > anotherDepth ? -1 : 1;
        }
    }

    public boolean match(ResourceNode node) {
        if( this.criteria == null ) return true;
        //compile the criteria as SpringEL, and evaluate against it
        try {
            Expression expression = elParser.parseExpression(criteria);
            // TODO create help context
            return (Boolean)expression.getValue(node);
        } catch (ParseException e) {
            throw new IllegalStateException("Can't parse " + criteria + " as spring EL expression", e);
        } catch (EvaluationException e) {
            throw new IllegalStateException("Can't evaluate " + node + " by " + criteria, e);
        }
    }

    static ExpressionParser elParser = new SpelExpressionParser();
}
