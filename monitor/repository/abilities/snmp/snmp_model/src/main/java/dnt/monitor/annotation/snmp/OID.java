package dnt.monitor.annotation.snmp;

import java.lang.annotation.*;

/**
 * <h1>SNMP OID</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
@Inherited
public @interface OID {
    /**
     * <h2>Field的OID</h2>
     * 如: 1.3.6.1.2.1.1.1
     * 或: iso.org.dod.internet.mgmt.mib-2.system.sysDescr
     *
     * @return Field OID, 不用以 . 开头
     */
    String value() default "";

    double unitRate() default 1;

    String constantValue() default "";
}
