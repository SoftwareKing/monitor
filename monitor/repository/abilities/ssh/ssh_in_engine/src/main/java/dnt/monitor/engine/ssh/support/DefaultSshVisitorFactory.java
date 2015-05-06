package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.engine.support.PooledVisitorFactory;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.model.Credential;
import org.apache.commons.pool.KeyedPoolableObjectFactory;
import org.springframework.stereotype.Component;

/**
 * <h1>The ssh visitor factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultSshVisitorFactory extends PooledVisitorFactory<SshCredential, SshVisitor> implements SshVisitorFactory{

    @Override
    protected KeyedPoolableObjectFactory<SshCredential, SshVisitor> createPoolFactory(ManagedNode node,
                                                                                      Resource device) {
        return new SshConnectionFactory(node, device);
    }

    @Override
    public boolean support(String address) {
        //only 主机地址，不支持 socket地址
        return !address.contains(":");
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof SshCredential;
    }
}
