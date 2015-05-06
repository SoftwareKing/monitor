package dnt.monitor.engine.wmi;

import dnt.monitor.engine.exception.WmiException;
import dnt.monitor.service.Visitor;
import net.happyonroad.credential.WindowsCredential;

/**
 * <h1>WMI visitor</h1>
 *
 * @author Jay Xiong
 */
public interface WmiVisitor extends Visitor<WindowsCredential> {
    String perform(String wql) throws WmiException;
}
