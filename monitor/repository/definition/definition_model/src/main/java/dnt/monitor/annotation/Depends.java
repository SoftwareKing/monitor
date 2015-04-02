package dnt.monitor.annotation;

import java.lang.annotation.*;

/**
 * <h1>标记指标的依赖关系</h1>
 * <p/>
 * <ul>
 * <li>有Depends标记的指标不需要进行采集（以后可能扩展为默认不需要进行采集）
 * <li>value内容应能表达出该指标依赖于哪些其他指标（目前忽略该信息）
 * </ul>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Depends {
    String[] value() default "";
}
