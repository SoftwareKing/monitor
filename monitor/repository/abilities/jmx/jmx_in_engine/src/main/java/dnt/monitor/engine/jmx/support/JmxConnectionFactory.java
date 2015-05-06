package dnt.monitor.engine.jmx.support;

import com.sun.jmx.remote.util.EnvHelp;
import dnt.monitor.engine.exception.JmxException;
import dnt.monitor.engine.jmx.JmxVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.model.SocketAddress;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.StringUtils;
import org.apache.commons.pool.BaseKeyedPoolableObjectFactory;

import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * <h1>为特定节点对应的主机创建JMX连接的工厂</h1>
 *
 * @author Jay Xiong
 */
class JmxConnectionFactory extends BaseKeyedPoolableObjectFactory<CredentialProperties, JmxVisitor> {

    private final ManagedNode node;
    private final Resource resource;

    public JmxConnectionFactory(ManagedNode node, Resource resource) {
        this.node = node;
        this.resource = resource;
    }

    @Override
    public JmxVisitor makeObject(CredentialProperties credential) throws Exception {
        JMXConnector connector = connect(credential);
        return new DefaultJmxVisitor(node, resource, credential, connector);
    }

    @Override
    public void destroyObject(CredentialProperties key, JmxVisitor visitor) throws Exception {
        visitor.getConnector().close();
    }

    /**
     * JMX的url组装参数有:
     *
     * <ul>
     * <li>protocol: rmi/jmxmp
     * <li>host
     * <li>port
     * <li>path
     * </ul>
     */
    JMXConnector connect(CredentialProperties credential) throws JmxException {
        SocketAddress address = IpUtils.parseSocketAddress(resource.getAddress());
        String path = credential.getProperty("path", "jmxrmi");
        String user = credential.getProperty("user");
        String password = credential.getProperty("password");
        try {
            String url = String.format("service:jmx:rmi:///jndi/rmi://%s:%d/%s", address.getHost(), address.getPort(), path);
            JMXServiceURL serviceURL = new JMXServiceURL(url);
            Map<String, Object> env = new HashMap<String, Object>();
            if(StringUtils.isNotBlank(user)){
                String[] credentials = {user, password};
                env.put("jmx.remote.credentials", credentials);
            }
            String checkPeriod = node.getProperty(EnvHelp.CLIENT_CONNECTION_CHECK_PERIOD);
            if( checkPeriod != null )
                env.put(EnvHelp.CLIENT_CONNECTION_CHECK_PERIOD, TimeInterval.parseInt(checkPeriod));
            String fetchTimeout = node.getProperty(EnvHelp.FETCH_TIMEOUT);
            if( fetchTimeout != null )
                env.put(EnvHelp.FETCH_TIMEOUT, TimeInterval.parseInt(fetchTimeout));
            return JMXConnectorFactory.connect(serviceURL, env);
        } catch (IOException e) {
            throw new JmxException("Create jmx connector failed for: " + resource, e);
        }
    }

}
