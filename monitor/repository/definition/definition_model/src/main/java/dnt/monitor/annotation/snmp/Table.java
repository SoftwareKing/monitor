package dnt.monitor.annotation.snmp;

import java.lang.annotation.*;

/**
 * <h1>SNMP Table</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Inherited
public @interface Table {
    /**
     * <h2>Table的OID</h2>
     * 如: 1.3.6.1.2.1.2.2
     * 或: iso.org.dod.internet.mgmt.mib-2.interfaces.ifTable
     *
     * @return Group OID, 不用以 . 开头
     */
    String value() default "";

    /**
     * <h2>表格下所有的OID名称的prefix</h2>
     *
     * @return 表格下所有oid名称的prefix
     */
    String prefix() default "";

}
