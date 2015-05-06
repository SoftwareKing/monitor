package dnt.monitor.engine.shell.support;

import dnt.monitor.engine.exception.ShellException;
import dnt.monitor.engine.shell.CommandExecutor;
import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.meta.shell.MetaCommand;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.TimeInterval;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <h1>执行Command</h1>
 *
 * @author mnnjie
 */
@Component
class DefaultCommandExecutor extends Bean implements CommandExecutor {
    static final Pattern INTERPOLATE_PTN = Pattern.compile("@args\\[(\\d+)\\]");

    public String execute(MetaCommand metaCommand, ShellVisitor visitor, String... args) throws ShellException {
        String commandScript;
        try {
            commandScript = interpolate(metaCommand.getValue(), args);
        } catch (ArrayIndexOutOfBoundsException e) {
            throw new ShellException("Error while interpolate " + metaCommand.getValue(), e);
        }
        String resultText;
        try {
            resultText = visitor.perform(TimeInterval.parseInt(metaCommand.getTimeout()), commandScript);
        } catch (ShellException ex) {
            throw new ShellException(ex.getExitCode(), "Execute:" + commandScript + " failed, " + ex.getMessage());
        } catch (Exception ex) {
            throw new ShellException(400, "Execute:" + commandScript + " failed", ex);
        }
        if (StringUtils.isBlank(resultText)) {
            throw new ShellException(400, "Execute:" + commandScript + " success with empty result");
        }
        return resultText;
    }

    public String interpolate(String origin, String... args) throws ShellException {
        Matcher m = INTERPOLATE_PTN.matcher(origin);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            int index = Integer.valueOf(m.group(1));
            String replacement = resolveVariable(args, index);
            try {
                m.appendReplacement(sb, replacement);
            } catch (IllegalArgumentException e) {
                e.printStackTrace();//just for catch it to debug
                throw e;
            }
        }
        m.appendTail(sb);
        return sb.toString().trim();
    }

    private String resolveVariable(String[] args, int index) throws ShellException {
        if( index < args.length){
            return args[index];
        }else{
            throw new ArrayIndexOutOfBoundsException("@args[" + index + "] from " + StringUtils.join(args, " "));
        }
    }

}
