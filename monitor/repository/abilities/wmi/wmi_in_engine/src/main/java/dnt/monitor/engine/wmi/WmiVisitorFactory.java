package dnt.monitor.engine.wmi;

import dnt.monitor.engine.service.VisitorFactory;
import net.happyonroad.credential.WindowsCredential;

/**
 * <h1>WmicVisitor Factory</h1>
 *
 * @author Jay Xiong
 */
public interface WmiVisitorFactory extends VisitorFactory<WindowsCredential, WmiVisitor> {
}
