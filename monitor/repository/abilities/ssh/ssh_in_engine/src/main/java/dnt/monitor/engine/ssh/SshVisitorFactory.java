package dnt.monitor.engine.ssh;

import dnt.monitor.engine.service.VisitorFactory;
import net.happyonroad.credential.SshCredential;

/**
 * <h1>The SSH Visitor Factory</h1>
 *
 * @author Jay Xiong
 */
public interface SshVisitorFactory extends VisitorFactory<SshCredential, SshVisitor>{
}
