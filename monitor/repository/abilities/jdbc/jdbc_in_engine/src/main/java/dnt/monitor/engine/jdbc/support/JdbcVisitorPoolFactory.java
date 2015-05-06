package dnt.monitor.engine.jdbc.support;

import dnt.monitor.engine.jdbc.ConnectionFactory;
import dnt.monitor.engine.jdbc.JdbcVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.NamedThreadFactory;
import org.apache.commons.pool.BaseKeyedPoolableObjectFactory;

import java.sql.Connection;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * <h1>Jdbc Visitor Object Factory for pool</h1>
 *
 * @author Jay Xiong
 */
class JdbcVisitorPoolFactory extends BaseKeyedPoolableObjectFactory<CredentialProperties, JdbcVisitor> {
    static Executor SET_TIMEOUT_EXECUTOR =
            Executors.newSingleThreadExecutor(new NamedThreadFactory("JdbcConn-SetTimeout"));
    private final ManagedNode       node;
    private final Resource          resource;
    private final ConnectionFactory factory;

    public JdbcVisitorPoolFactory(ManagedNode node, Resource resource, ConnectionFactory factory) {
        this.node = node;
        this.resource = resource;
        this.factory = factory;
    }

    @Override
    public JdbcVisitor makeObject(CredentialProperties credential) throws Exception {
        Connection connection = factory.buildConnection(resource, credential);
        String strTimeout = node.getProperty("jdbc.connection.timeout", credential.getProperty("connection.timeout"));
        int timeout = TimeInterval.parseInt(strTimeout);
        connection.setNetworkTimeout(SET_TIMEOUT_EXECUTOR, timeout);
        return new DefaultJdbcVisitor(node, resource, credential, connection);
    }

    @Override
    public void destroyObject(CredentialProperties credential, JdbcVisitor visitor) throws Exception {
        visitor.getConnection().close();
    }
}
