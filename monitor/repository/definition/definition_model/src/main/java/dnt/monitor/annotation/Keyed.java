package dnt.monitor.annotation;

import java.lang.annotation.*;

/**
 * <h1>标记指标或者组件是否是关键的</h1>
 * <p/>
 * <ul>
 * <li>当标记在有@Indicator标记的属性上时，指代其是否是关键指标，如果是，则在采集该对象时，默认会将该数值采集上来
 * <li>当标记在有@Metric标记的属性上时，指代其是否是关键性能指标，如果是，不仅会默认采集，还意味着其对所属被管对象的性能状态影响传递不打折扣
 * <li>当标记在有@Config标记的属性上时，指代其是否是关键配置指标，如果是，不仅会默认采集，还意味着其对所属被管对象的配置状态传递不打折扣
 * <li>当标记在资源的组件属性，或者组件对象上时，标记该组件是否为关键组件，关键组件对其所属资源的性能/配置状态影响传递不打折扣；在资源数据采集时，关键组件的数据也会被一并采集上来
 * </ul>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Keyed {
    /**
     * <h2>用于对组件是否关键的条件控制</h2>
     * Spring EL表达式，Evaluate的对象是相应的组件；
     *
     * @return Spring EL表达式，默认为空，不进行条件性控制
     */
    String value() default "";
}
