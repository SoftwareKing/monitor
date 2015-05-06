package dnt.monitor.annotation.snmp;

import java.lang.annotation.*;

/**
 * <h1>Match</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Snmp {
    OS[] value() default {};
}
