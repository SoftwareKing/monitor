package dnt.monitor.engine.jmx.support;

import dnt.monitor.engine.jmx.JmxVisitor;
import dnt.monitor.engine.support.AbstractVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;

import javax.management.remote.JMXConnector;
import java.io.IOException;

/**
 * <h1>Default Jmx Visitor</h1>
 *
 * @author Jay Xiong
 */
class DefaultJmxVisitor extends AbstractVisitor<CredentialProperties> implements JmxVisitor {

    private final JMXConnector connector;

    public DefaultJmxVisitor(ManagedNode node,Resource resource, CredentialProperties credential, JMXConnector connector) {
        super(node, resource, credential);
        this.connector = connector;
    }

    public JMXConnector getConnector() {
        return connector;
    }

    @Override
    public boolean isAvailable() {
        try {
            return connector.getMBeanServerConnection() != null ;
        } catch (IOException e) {
            return false;
        }
    }
}
