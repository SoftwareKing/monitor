/**
 * Developer: Kadvin Date: 15/2/16 上午10:29
 */
package dnt.monitor.annotation;

import java.lang.annotation.*;

/**
 * <h1>系统对组件进行定位时,</h1>
 * 系统的资源对象基本都可以通过管理路径(path)进行定位，如某个主机: /default/group1/dev1
 * 在许多场景下，需要对具体组件进行定位，如，为组件分配rrd采集的文件名称，
 * 此时就需要为该组件生成相对唯一路径，我们设计的方案为，将组件视为资源下的一个部分，通过类似于html的锚点来定位
 * 如:
 * <ul>
 * <li>该主机的总体CPU，其定位URL为： /default/group1/dev1#CPU_0
 * <li>该主机的第一个CPU，其定位URL为: /default/group1/dev1#CPU_1
 * </ul>
 * anchor的prefix一般为其类型，suffix一般为其实例，
 * 默认为数据库id，但对于尚未由服务器入库的组件对象，其数据库id均为null，
 * 所以，一般应用开发者，应该为组件设定一个不依赖于数据库的物理id
 * 另外，由于anchor需要参与到url的组成中，所以，应该遵循url编码规范，不要包含 "/"，"#"， "?" 等字符
 * 也尽量不要包含中文等需要url转码(encode/decode)的字符
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Inherited
public @interface Anchor {
    /**
     * <h2>计算某个组件的锚点所用的SpringEL表达式</h2>
     * 该表达式以组件实例为当前上下文，其他几个数值将会变为变量
     *
     * @return Spring EL表达式字符串
     */
    String expression() default "#prefix + #connector + #value";

    String prefix() default "simpleClassName";

    String value() default "id";  //如果为空，意思是不生成

    String connector() default "_";
}
