package dnt.monitor.annotation.shell;

import java.lang.annotation.*;

/**
 * <h1>Match</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Shell {
    OS[] value() default {};
}
