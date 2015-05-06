package dnt.monitor.engine.shell.support;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.ShellCredential;
import net.happyonroad.util.StringUtils;

/**
 * <h1>Power Shell Visitor</h1>
 *
 * @author Jay Xiong
 */
class PowerShellVisitor extends AbstractShellVisitor{
    public PowerShellVisitor(ManagedNode node, Resource resource, ShellCredential credential) {
        super(node, resource, credential);
    }

    @Override
    protected String availableCommand() {
        return "powershell /?";
    }

    @Override
    protected String[] assemble(String script, Object[] args) {
        StringBuilder fullCommand = new StringBuilder();
        fullCommand.append(script).append(" ");
        fullCommand.append(StringUtils.join(args, " "));
        return new String[]{"powershell", "-NoLogo", "-NonInteractive", "-Command", fullCommand.toString()};
    }
}
