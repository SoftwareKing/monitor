/**
 * Developer: Kadvin Date: 14/12/25 下午2:40
 */
package dnt.monitor.annotation;

import java.lang.annotation.*;

/**
 * <h1>度量</h1>
 *
 * 度量的核心定义为： 其数据可以被连续性记录，以及基于该连续性记录进行归并/采样
 *
 * 往往需要对其记录的数据进行 对比，展示曲线等
 *
 * Metric变化之后可能会引起发出性能事件
 *
 * <code>@Metric</code>可以标记在普通的属性上，暂时不能标记在结构体(entry)上
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Metric {

    /**
     * <h2>红色状态阈值</h2>
     * @return 以<code>unit</code>为单位的数值
     */
    float critical() default 0;

    /**
     * <h2>黄色状态阈值</h2>
     * @return 以<code>unit</code>为单位的数值
     */
    float warning() default 0;

    /**
     * <h2>性能指标的单位</h2>
     * @return 字符串形式的单位，最终应该有地方统一管理
     */
    String unit() default "";
}
