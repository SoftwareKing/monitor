package dnt.monitor.annotation.ssh;

import java.lang.annotation.*;

/**
 * <h1>对属性值的处理</h1>
 *
 * @author mnnjie
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Value {

    String value() default "";

    /**
     * 结果转换器，用于将结果转换为属性的类型(为空时使用默认的转换器)
     */
    String converter() default "";

    /**
     * 结果转换格式(配合converter)
     */
    String format() default "";

    /**
     * <pre>
     * 采到的原始值将乘以unitRate以完成单位转换
     * 当unitRate<=0 || unitRate==1,不做转换
     * 对于非数值类型指标，不做转换
     * </pre>
     */
    double unitRate() default 1;
}
