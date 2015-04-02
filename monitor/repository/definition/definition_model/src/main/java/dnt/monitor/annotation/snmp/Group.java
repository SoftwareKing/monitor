package dnt.monitor.annotation.snmp;

import java.lang.annotation.*;

/**
 * <h1>SNMP Group Node</h1>
 * <p/>
 * value or notation必须存在其中一项
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Inherited
public @interface Group {
    /**
     * <h2>Group的OID</h2>
     * 如: 1.3.6.1.2.1.1
     * 或: iso.org.dod.internet.mgmt.mib-2.system
     *
     * @return Group OID, 不用以 . 开头
     */
    String value() default "";

    /**
     * <h2>分组下所有的OID名称的prefix</h2>
     *
     * @return 分组下所有oid名称的prefix
     */
    String prefix() default "";
}
