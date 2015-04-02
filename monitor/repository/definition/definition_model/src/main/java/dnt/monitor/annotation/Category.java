/**
 * Developer: Kadvin Date: 14/12/27 下午9:43
 */
package dnt.monitor.annotation;

import java.lang.annotation.*;

/**
 * Annotation the resource model category
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Inherited
public @interface Category {
    //The category name:
    //  /device/host/windows
    String value();

    //The category alias
    String alias() default "";

    //The category description
    String description() default "";

    //The credentials
    String[] credentials() default {};
}
