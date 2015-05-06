package dnt.monitor.annotation.snmp;

import dnt.monitor.service.sampling.TransformerHandler;

import java.lang.annotation.*;

/**
 * 默认情况下，@Group或者@Table标记将产生原始数据GeneralMap或List&lt;GeneralMap&gt;,分别对应SingleInstance和MultipleInstances
 * 当与该默认情况不符（比如SingleInstance的数据应由@Table产生）时，可以通过@Transformer标记来声明TransformerHandler实现类进行转换
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Inherited
public @interface Transformer {
    Class<? extends TransformerHandler> value();
}
