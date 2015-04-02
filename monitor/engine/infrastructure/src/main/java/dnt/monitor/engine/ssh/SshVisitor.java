package dnt.monitor.engine.ssh;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.service.Visitor;

/**
 * <h1>The SSH Visitor(Command Executor)</h1>
 *
 * @author Jay Xiong
 */
public interface SshVisitor extends Visitor {
    /**
     * <h2>执行SSH脚本</h2>
     *
     * @param script 被执行的脚本
     * @return 执行的结果(stdout输出, exit code, stderr输出被封装在SshException中)
     * @throws SshException
     */
    String perform(String script) throws SshException;

    /**
     * <h2>执行SSH脚本</h2>
     *
     * @param script 被执行的脚本
     * @param timeout 超时时间
     * @return 执行的结果(stdout输出, exit code, stderr输出被封装在SshException中)
     * @throws SshException (包括超时异常)
     */
    String perform(String script, long timeout) throws SshException;
}
