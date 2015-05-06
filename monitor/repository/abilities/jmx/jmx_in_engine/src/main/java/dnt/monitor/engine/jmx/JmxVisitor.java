package dnt.monitor.engine.jmx;

import dnt.monitor.service.Visitor;
import net.happyonroad.credential.CredentialProperties;

import javax.management.remote.JMXConnector;

/**
 * <h1>JMX Visitor</h1>
 *
 * @author Jay Xiong
 */
public interface JmxVisitor extends Visitor<CredentialProperties> {
    JMXConnector getConnector() ;

    //TODO define JmxVisitor business methods
}
