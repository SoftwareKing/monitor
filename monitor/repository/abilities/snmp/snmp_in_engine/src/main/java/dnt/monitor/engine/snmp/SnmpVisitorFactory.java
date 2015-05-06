package dnt.monitor.engine.snmp;

import dnt.monitor.engine.service.VisitorFactory;
import net.happyonroad.credential.SnmpCredential;

/**
 * <h1>SNMP访问者工厂</h1>
 *
 * @author Jay Xiong
 */
public interface SnmpVisitorFactory extends VisitorFactory<SnmpCredential,MibAwareSnmpVisitor>{
}
