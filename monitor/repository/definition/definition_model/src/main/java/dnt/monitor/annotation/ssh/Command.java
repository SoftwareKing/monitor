package dnt.monitor.annotation.ssh;

import java.lang.annotation.*;

/**
 * <h1>取值指令</h1>
 *
 * @author mnnjie
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE,ElementType.METHOD, ElementType.FIELD})
@Inherited
public @interface Command {
    /**
     * 指令文本或以Path:开头的指令脚本路径
     */
    String value();

    /**
     * 命令执行的超时时间
     *
     * @return 超时时间，1d2h3m2s10ms 格式
     */
    String timeout() default "1m";
    // 未来如果支持多os的脚本机制，需要通过该属性区分os
    // String os();
}
