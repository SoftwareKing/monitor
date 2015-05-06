package dnt.monitor.meta;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * <h1>事件信息</h1>
 * <p/>
 * 包括:
 * <ul>
 * <li>按发生源分: 资源事件和组件事件两大类
 * <li>按类型分:   状态事件 性能事件 配置事件
 * <ul>状态事件其中可以分为:
 * <li>可用性状态变化
 * <li>性能状态变化
 * <li>配置状态变化
 * </ul>
 * </ul>
 * <p/>
 * 这些事件可以通过如下API获得:
 * <ul>
 * <li>MetaResource#getEvents 获得就是资源的状态事件，不包括性能/配置指标事件
 * <li>MetaResource#getAllEvents 获得就是资源的所有事件，包括性能/配置指标事件，也包括组件的状态事件，组件的性能，配置指标事件
 * <li>MetaComponent#getEvents 获得就是组件的状态事件，不包括性能/配置指标事件
 * <li>MetaComponent#getAllEvents 获得就是组件的所有事件，包括性能/配置指标事件
 * </ul>
 *
 * @author Jay Xiong
 */
public class MetaEvent extends MetaObject {
    //事件的表达式，如，状态事件的表达:
    //   ManagedObject#performance is Critical
    //   ManagedObject#performance is Warning
    //   ManagedObject#performance is Normal
    //   ManagedObject#performance is UnKnown

    //   ManagedObject#availability is Available
    //   ManagedObject#availability is Unavailable
    //   ManagedObject#availability is Testing
    //   ManagedObject#availability is UnKnown

    //   ManagedObject#configStatus is Changed
    //   ManagedObject#configStatus is UnChanged
    //   ManagedObject#configStatus is UnKnown

    // 资源性能指标事件
    //   Host#processCount is Critical
    //   Host#processCount is Warning
    //   Host#processCount is Normal
    //   Host#processCount is UnKnown

    // 资源配置指标事件
    //   Resource#address is Changed
    //   Resource#address is UnChanged
    //   Resource#address is UnKnown

    // 组件性能指标事件
    //   CPU#usage is Critical
    //   CPU#usage is Warning
    //   CPU#usage is Normal
    //   CPU#usage is UnKnown

    // 组件配置指标事件
    //   CPU#frequence is Changed
    //   CPU#frequence is UnChanged
    //   CPU#frequence is UnKnown
    private String source, property, value;

    @JsonCreator
    public MetaEvent(String source, String property, String value) {
        this.setSource(source);
        this.setProperty(property);
        this.setValue(value);
    }

    @Override
    public String getName() {
        return source + "#" + property + " is " + value;
    }


    /**
     * <h2>返回事件源对象名称</h2>
     *
     * @return 源对象名称
     */
    public String getSource() {
        return source;
    }

    /**
     * <h2>返回事件对应的属性名称</h2>
     *
     * @return 对应的属性名称
     */
    public String getProperty() {
        return property;
    }

    /**
     * <h2>返回事件对应的值</h2>
     *
     * @return 对应的值
     */
    public String getValue() {
        return value;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
