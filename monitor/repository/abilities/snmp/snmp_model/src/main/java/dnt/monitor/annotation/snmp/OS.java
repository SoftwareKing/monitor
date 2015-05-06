package dnt.monitor.annotation.snmp;

import dnt.monitor.service.sampling.TransformerHandler;

import java.lang.annotation.*;

/**
 * <h1>限定在特定os上面的shell指令</h1>
 *
 * @author Jay Xiong
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface OS {
    /**
     * <h2>匹配的操作系统</h2>
     * 可以为 linux, osx, windows 等
     * 以后甚至可以支持 linux/centos, osx/yosemite, windows/win8
     *
     * @return 缺省为 *，指代所有的操作系统
     */
    String type() default "*";

    /**
     * <h2>适用于相应os的指令</h2>
     *
     * @return 指令
     */
    Table[] tables() default {};

    /**
     * <h2>适用于相应os的行映射</h2>
     *
     * @return 映射
     */
    Group[] groups() default {};

    /**
     * <h2>适用于相应os的列映射</h2>
     *
     * @return 映射
     */
    OID oid() default @OID;

    Transformer transformer() default @Transformer(TransformerHandler.class);
}
