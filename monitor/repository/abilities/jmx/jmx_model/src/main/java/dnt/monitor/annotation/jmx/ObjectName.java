package dnt.monitor.annotation.jmx;

import java.lang.annotation.*;

/**
 * <h1>JMX Object Name</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface ObjectName {
    String value();
}
