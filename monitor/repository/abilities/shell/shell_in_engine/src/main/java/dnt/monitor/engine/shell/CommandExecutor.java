package dnt.monitor.engine.shell;

import dnt.monitor.engine.exception.ShellException;
import dnt.monitor.meta.shell.MetaCommand;

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
     * @param args     额外的参数
     * @return  结果文本
     */
    String execute(MetaCommand metaCommand, ShellVisitor visitor, String... args) throws ShellException;
}
