package dnt.monitor.annotation.shell;

import java.lang.annotation.*;

/**
 * <h1>为命令设定参数</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE,ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Args {
    String[] value() default {};
}
