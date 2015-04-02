package dnt.monitor.annotation.ssh;

import java.lang.annotation.*;

/**
 * <h1>以键值对形式处理指令的执行结果</h1>
 *
 * @author mnnjie
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Mapping {
    /**
     * headers
     */
    String[] value() default {};

    /**
     * 跳过的行数
     */
    int skipLines() default 0;

    /**
     * 行分隔符的正则表达式，默认为换行符
     */
    String rowSeparator() default "\\s*\\r?\\n\\s*";

    /**
     * 列分隔符的正则表达式，默认为空白符
     */
    String colSeparator() default "\\s+";
}
