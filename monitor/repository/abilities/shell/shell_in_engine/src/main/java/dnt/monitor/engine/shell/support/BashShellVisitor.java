package dnt.monitor.engine.shell.support;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.ShellCredential;
import net.happyonroad.util.StringUtils;

/**
 * <h1>Bash Shell Visitor</h1>
 *
 * @author Jay Xiong
 */
class BashShellVisitor extends AbstractShellVisitor {
    public BashShellVisitor(ManagedNode node, Resource resource, ShellCredential credential) {
        super(node, resource, credential);
    }

    @Override
    protected String availableCommand() {
        return "which bash";
    }

    @Override
    protected String[] assemble(String script, Object[] args) {
        StringBuilder fullCommand = new StringBuilder();
        fullCommand.append(script).append(" ");
        fullCommand.append(StringUtils.join(args, " "));
        return new String[]{"bash", "-c", fullCommand.toString()};
    }
}
