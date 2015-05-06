package dnt.monitor.engine.wbem.support;

import dnt.monitor.engine.exception.WbemException;
import dnt.monitor.engine.wbem.WbemVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.model.SocketAddress;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.IpUtils;
import org.apache.commons.pool.BaseKeyedPoolableObjectFactory;

import javax.cim.CIMObjectPath;
import javax.security.auth.Subject;
import javax.wbem.WBEMException;
import javax.wbem.client.PasswordCredential;
import javax.wbem.client.UserPrincipal;
import javax.wbem.client.WBEMClient;
import javax.wbem.client.WBEMClientFactory;

/**
 * <h1>为特定节点对应的主机创建WBEM连接的工厂</h1>
 *
 * @author Jay Xiong
 */
class WbemConnectionFactory extends BaseKeyedPoolableObjectFactory<CredentialProperties, WbemVisitor> {

    private final ManagedNode node;
    private final Resource    resource;

    public WbemConnectionFactory(ManagedNode node, Resource resource) {
        this.node = node;
        this.resource = resource;
    }

    @Override
    public WbemVisitor makeObject(CredentialProperties credential) throws Exception {
        WBEMClient client = connect(credential);
        return new DefaultWbemVisitor(node, resource, credential, client);
    }

    @Override
    public void destroyObject(CredentialProperties key, WbemVisitor visitor) throws Exception {
        visitor.getClient().close();
    }

    /**
     * Connect to webem server
     */
    WBEMClient connect(CredentialProperties credential) throws WbemException {
        SocketAddress socketAddress = IpUtils.parseSocketAddress(resource.getAddress());
        String host = socketAddress.getHost();
        int port = socketAddress.getPort();
        String namespace = credential.getProperty("namespace");
        //String sn = credential.getProperty("sn");
        String user = credential.getProperty("user");
        String password = credential.getProperty("password");
        String protocol = "http";
        if (port == 5989)
            protocol = "https";
        //String url = protocol + "://" + host + ":" + port + "/";
        try {
            CIMObjectPath path = new CIMObjectPath(protocol, host, String.valueOf(port), namespace, null, null);
            Subject subject = new Subject();
            subject.getPrincipals().add(new UserPrincipal(user));
            subject.getPrivateCredentials().add(new PasswordCredential(password));

            WBEMClient client = WBEMClientFactory.getClient("CIM-XML");
            client.initialize(path, subject, null);

            //TODO make timeout control really works
            String timeout = node.getProperty("webem.connect.timeout");
            if( timeout != null ){
                client.setProperty("webem.connect.timeout", String.valueOf(TimeInterval.parseInt(timeout)));
            }
            return client;
        } catch (WBEMException e) {
            throw new WbemException("Create Webem Client failed for: ", e);
        }
    }

}
