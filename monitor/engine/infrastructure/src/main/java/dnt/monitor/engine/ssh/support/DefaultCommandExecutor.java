package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.ssh.CommandExecutor;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.meta.ssh.MetaCommand;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.TimeInterval;
import org.apache.commons.lang.StringUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

/**
 * <h1>执行Command</h1>
 *
 * @author mnnjie
 */
@Component
@SuppressWarnings("unused")
public class DefaultCommandExecutor extends Bean implements CommandExecutor {

    public String execute(MetaCommand metaCommand, SshVisitor visitor) throws SshException {
        String commandScript = readScript(metaCommand);
        String resultText;
        try {
            resultText = visitor.perform(commandScript, TimeInterval.parseInt(metaCommand.getTimeout()));
        } catch (Exception ex) {
            throw new SshException(400, "execute command failed:" + commandScript, ex);
        }
        if(StringUtils.isBlank(resultText)){
            throw new SshException(400, "execute command success,but result is empty:" + commandScript);
        }
        return resultText;
    }

    /**
     * 解析指令为可执行文本
     */
    private String readScript(MetaCommand metaCommand) throws SshException {
        if (metaCommand == null || StringUtils.isBlank(metaCommand.getValue())) {
            throw new SshException(400, "command is null or empty");
        }
        String commandScript = metaCommand.getValue();
        if (StringUtils.startsWithIgnoreCase(commandScript, "classpath:")) {
            commandScript = readScriptFile(commandScript.substring("classpath:".length()));
            if (StringUtils.isBlank(commandScript)) {
                throw new SshException(400, "command script file is empty:"+commandScript);
            }
        }
        return commandScript;
    }

    /**
     * 按照路径读取指令脚本文件内容
     */
    private String readScriptFile(String scriptPath) throws SshException {
        try {
            return FileCopyUtils.copyToString(new EncodedResource(new ClassPathResource(scriptPath)).getReader());
        } catch (Exception ex) {
            throw new SshException(400, "read command script from file failed:" + scriptPath, ex);
        }
    }

}
