package dnt.monitor.annotation.shell;

import java.lang.annotation.*;

/**
 * <h1>以键值对形式处理指令的执行结果</h1>
 * 现在支持三种数据划分方式：
 * <ol>
 * <li>采用separator切割, colSeparator </li>
 * <li>采用align机制，对特定行(row index = align) 进行采样/对齐，按照其对齐情况进行数据切割</li>
 * <li>按照正则表达式进行切割: pattern</li>
 * </ol>
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
     * 改用：如果不需要命令行输出的表头，则不应该使用skip lines特性，而是让命令直接
     * grep -v ^第一列名称, 或者 tail -n+x 第几行开始显示
     */
    //int skipLines() default 0;

    /**
     * 行分隔符的正则表达式，默认为换行符
     */
    String rowSeparator() default "\\s*\\r?\\n\\s*";

    /**
     * 列分隔符的正则表达式，默认为空白符
     */
    String colSeparator() default "\\s+";

    /**
     * 基于哪一行进行等宽对齐，默认为-1，不进行等宽对齐
     */
    int align() default -1;

    /**
     * 数据行的正则表达式，设置了这个方式，一般就不再需要 colSeparator, align等机制了
     */
    String pattern() default "";

}
