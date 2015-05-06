package dnt.monitor.engine.jmx.support;

import dnt.monitor.engine.jmx.JmxVisitor;
import dnt.monitor.engine.jmx.JmxVisitorFactory;
import dnt.monitor.engine.support.PooledVisitorFactory;
import dnt.monitor.exception.SampleException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.model.Credential;
import org.apache.commons.pool.KeyedPoolableObjectFactory;
import org.springframework.stereotype.Component;

/**
 * <h1>Default JmxVisitor Factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultJmxVisitorFactory extends PooledVisitorFactory<CredentialProperties,JmxVisitor> implements JmxVisitorFactory {

    @Override
    protected KeyedPoolableObjectFactory<CredentialProperties, JmxVisitor> createPoolFactory(ManagedNode node,
                                                                                             Resource device)
            throws SampleException {
        return new JmxConnectionFactory(node, device);
    }

    @Override
    public boolean support(String address) {
        //only socket地址
        return address.contains(":");
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof CredentialProperties &&
               Credential.Jmx.equals(credential.name());

    }
}
