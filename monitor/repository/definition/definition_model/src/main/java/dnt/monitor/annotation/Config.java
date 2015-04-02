/**
 * Developer: Kadvin Date: 14/12/25 下午2:40
 */
package dnt.monitor.annotation;

import java.lang.annotation.*;

/**
 * <h1>配置</h1>
 * <p/>
 * 配置的核心定义是: 其数据直接/间接来自于被管理(采集)的对象
 * 其变化之后会导致系统发出配置变更事件
 * <code>@Config</code>可以标记在普通的属性上，或者结构体(entry)上
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Config {

    /**
     * <h2>指标的单位</h2>
     *
     * @return 字符串形式的单位，最终应该有地方统一管理
     */
    String unit() default "";
}
