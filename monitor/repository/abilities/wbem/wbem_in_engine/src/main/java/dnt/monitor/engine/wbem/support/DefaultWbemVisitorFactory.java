package dnt.monitor.engine.wbem.support;

import dnt.monitor.engine.wbem.WbemVisitor;
import dnt.monitor.engine.wbem.WbemVisitorFactory;
import dnt.monitor.engine.support.PooledVisitorFactory;
import dnt.monitor.exception.SampleException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.model.Credential;
import org.apache.commons.pool.KeyedPoolableObjectFactory;
import org.springframework.stereotype.Component;

/**
 * <h1>Default Webem Visitor Factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultWbemVisitorFactory extends PooledVisitorFactory<CredentialProperties, WbemVisitor> implements
                                                                                                WbemVisitorFactory {
    @Override
    protected KeyedPoolableObjectFactory<CredentialProperties, WbemVisitor> createPoolFactory(ManagedNode node,
                                                                                               Resource device)
            throws SampleException {
        return new WbemConnectionFactory(node, device);
    }


    @Override
    public boolean support(String address) {
        //only 主机地址，不支持 socket地址
        return !address.contains(":");
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof CredentialProperties &&
               Credential.Webem.equals(credential.name());
    }
}
