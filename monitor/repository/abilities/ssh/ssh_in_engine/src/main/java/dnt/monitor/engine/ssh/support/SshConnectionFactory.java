package dnt.monitor.engine.ssh.support;

import com.trilead.ssh2.Connection;
import com.trilead.ssh2.ServerHostKeyVerifier;
import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import dnt.monitor.service.ErrorCodes;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.pool.BaseKeyedPoolableObjectFactory;

import java.io.File;
import java.io.IOException;

/**
 * <h1>为特定节点对应的主机创建ssh连接的工厂</h1>
 *
 * @author Jay Xiong
 */
class SshConnectionFactory extends BaseKeyedPoolableObjectFactory<SshCredential, SshVisitor> implements
                                                                                             ServerHostKeyVerifier {

    private final ManagedNode node;
    private final Resource resource;

    public SshConnectionFactory(ManagedNode node, Resource resource) {
        this.node = node;
        this.resource = resource;
    }

    @Override
    public SshVisitor makeObject(SshCredential credential) throws Exception {
        Connection connection = connect(credential);
        String strCmdTimeout = node.getProperty("ssh.cmd.timeout", TimeInterval.parse(credential.getTimeout()));
        int cmdTimeout = TimeInterval.parseInt(strCmdTimeout);
        return new DefaultSshVisitor(node, resource, credential, connection, cmdTimeout);
    }

    @Override
    public void destroyObject(SshCredential key, SshVisitor visitor) throws Exception {
        visitor.close();
    }

    @Override
    public boolean validateObject(SshCredential key, SshVisitor visitor) {
        return visitor.isAvailable();
    }

    /**
     * collect with authentication 目前支持3种，安全密钥的方式不支持
     */
    Connection connect(SshCredential credential) throws SshException {
        int port = credential.getPort();
        String user = credential.getUser();
        String password = credential.getPassword();

        Connection conn = new Connection(resource.getAddress(), port);
        try {
            int kexTimeout = TimeInterval.parseInt(node.getProperty("ssh.kex.timeout", "15s"));
            int connectTimeout = TimeInterval.parseInt(node.getProperty("ssh.connect.timeout", "15s"));
            //建议： 15秒连接超时，15秒SSH Key交换超时, as same
            conn.connect(this, connectTimeout, kexTimeout);

            String[] methods = conn.getRemainingAuthMethods(user);
            boolean authorized = false;

            if (methods.length == 0) {
                authorized = conn.authenticateWithNone(user); //SSH2: no authentication is needed
            } else {
                if( credential.hasPassword() ){
                    if (conn.isAuthMethodAvailable(user, "password")) {//SSH2: password auth
                        authorized = conn.authenticateWithPassword(user, password);
                    }
                    if (!authorized && conn.isAuthMethodAvailable(user, "keyboard-interactive")) {
                        SshAuthCallback callback = new SshAuthCallback(password);
                        authorized = conn.authenticateWithKeyboardInteractive(user, callback);
                    }
                } else if (credential.hasPermFile() ){
                    if (conn.isAuthMethodAvailable(user, "publickey")) {
                        File pemFile = new File(credential.getPermFile());
                        authorized = conn.authenticateWithPublicKey(credential.getUser(), pemFile, null);
                    }
                } else{
                    throw new SshException(ErrorCodes.PROBE_AUTHORIZATION_ERROR,
                                           "You ssh credential should contains password or perm file: " + credential);
                }
            }
            if (!authorized) {
                throw new SshException(ErrorCodes.PROBE_AUTHORIZATION_ERROR, "Authoring failed for: " + credential);
            }
            return conn;
        } catch (IOException e) {
            String message = String.format("Connect to %s:%d failed, because of: %s",
                                           user, port, MiscUtils.describeException(e));
            conn.close();
            throw new SshException(ErrorCodes.PROBE_SAMPLE_ERROR, message, e);
        }
    }

    @Override
    public boolean verifyServerHostKey(String hostname, int port, String serverHostKeyAlgorithm, byte[] serverHostKey)
            throws Exception {
        //任意主机都接受，而不是去看本地的 authorized_keys，避免认证目标主机时，由于服务器回问信任时阻塞
        return true;
    }
}
