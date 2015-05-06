package dnt.monitor.engine.jdbc.support;

import dnt.monitor.engine.exception.JdbcException;
import dnt.monitor.engine.jdbc.ConnectionFactory;
import dnt.monitor.engine.jdbc.JdbcVisitor;
import dnt.monitor.engine.jdbc.JdbcVisitorFactory;
import dnt.monitor.engine.support.PooledVisitorFactory;
import dnt.monitor.exception.SampleException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import dnt.monitor.service.ErrorCodes;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.model.Credential;
import org.apache.commons.pool.KeyedPoolableObjectFactory;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.ServiceLoader;

/**
 * <h1>Default JdbcVisitor Factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultJdbcVisitorFactory extends PooledVisitorFactory<CredentialProperties, JdbcVisitor> implements JdbcVisitorFactory{
    final static Map<ClassLoader, ServiceLoader<ConnectionFactory>> serviceLoaders =
            new HashMap<ClassLoader, ServiceLoader<ConnectionFactory>>();

    @Override
    protected KeyedPoolableObjectFactory<CredentialProperties, JdbcVisitor> createPoolFactory(ManagedNode node,
                                                                                              Resource device)
            throws SampleException {
        ConnectionFactory connectionFactory = locateDatabaseFactory(device.getType());
        return new JdbcVisitorPoolFactory(node, device, connectionFactory);
    }

    @Override
    public boolean support(String address) {
        //only socket地址
        return address.contains(":");
    }

    @Override
    public boolean support(Credential credential) {
        return (credential instanceof CredentialProperties)
               && Credential.Jdbc.equals(credential.name());
    }

    private ConnectionFactory locateDatabaseFactory(String type) throws JdbcException {
        for (ConnectionFactory factory : contextServiceLoader()) {
            if (factory.support(type))
                return factory;
        }
        throw new JdbcException(ErrorCodes.PROBE_NOT_SUPPORTED_MO_TYPE, "The db type: " + type + " is not supported now");
    }

    private static ServiceLoader<ConnectionFactory> contextServiceLoader() {
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        ServiceLoader<ConnectionFactory> sl = serviceLoaders.get(cl);
        if(sl == null){
            synchronized (serviceLoaders){//replace with read/write lock
                sl = ServiceLoader.load(ConnectionFactory.class, cl);
                serviceLoaders.put(cl, sl);
            }
        }
        return sl;
    }

}
