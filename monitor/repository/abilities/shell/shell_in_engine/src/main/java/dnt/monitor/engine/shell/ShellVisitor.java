package dnt.monitor.engine.shell;

import dnt.monitor.engine.exception.ShellException;
import dnt.monitor.service.Visitor;
import net.happyonroad.credential.ShellCredential;

/**
 * <h1>本地访问器</h1>
 * <p/>
 * 类似于SshVisitor，基于本地环境执行一段脚本，返回文字内容
 * windows基于power shell; linux, osx基于bash
 *
 * @author Jay Xiong
 */
public interface ShellVisitor<C extends ShellCredential> extends Visitor<C> {
    /**
     * <h2>执行SSH脚本</h2>
     *
     * @param script 被执行的命令
     * @param args   参数
     * @return 执行的结果(stdout输出, exit code, stderr输出被封装在SshException中)
     * @throws dnt.monitor.engine.exception.ShellException
     */
    String perform(String script, Object... args) throws ShellException;

    /**
     * <h2>执行SSH脚本</h2>
     *
     * @param timeout 超时设置，单位为毫秒, 0为没有超时控制
     * @param script  被执行的命令
     * @param args    参数
     * @return 执行的结果(stdout输出, exit code, stderr输出被封装在SshException中)
     * @throws dnt.monitor.engine.exception.ShellException
     */
    String perform(long timeout, String script, Object... args) throws ShellException;

}
