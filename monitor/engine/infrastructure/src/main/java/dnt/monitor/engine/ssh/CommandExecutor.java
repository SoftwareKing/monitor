package dnt.monitor.engine.ssh;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.meta.ssh.MetaCommand;

/**
 * <h1>执行Command</h1>
 *
 * @author mnnjie
 */
public interface CommandExecutor {
    /**
     * 执行Command并返回结果文本
     * @param metaCommand 指令封装
     * @param visitor 访问器
     * @return  结果文本
     */
    String execute(MetaCommand metaCommand, SshVisitor visitor) throws SshException;
}
