package dnt.monitor.annotation.jmx;

import java.lang.annotation.*;

/**
 * <h1>JMX Object Attr</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface ObjectAttr {
    String value();

    String defaultValue() default "";
}
