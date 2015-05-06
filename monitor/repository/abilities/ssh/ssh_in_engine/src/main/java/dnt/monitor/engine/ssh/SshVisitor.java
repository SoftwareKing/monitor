package dnt.monitor.engine.ssh;

import dnt.monitor.engine.shell.ShellVisitor;
import net.happyonroad.credential.SshCredential;

/**
 * <h1>The SSH Visitor(Command Executor)</h1>
 *
 * @author Jay Xiong
 */
public interface SshVisitor extends ShellVisitor<SshCredential> {
}
