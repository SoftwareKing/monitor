package dnt.monitor.engine.ssh.support;

import com.trilead.ssh2.Connection;
import com.trilead.ssh2.Session;
import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.engine.support.AbstractVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import dnt.monitor.service.ErrorCodes;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.util.StringUtils;
import org.apache.commons.io.IOUtils;

import java.io.IOException;

import static com.trilead.ssh2.ChannelCondition.*;

/**
 * <h1>The default ssh visitor</h1>
 *
 * @author Jay Xiong
 */
class DefaultSshVisitor extends AbstractVisitor<SshCredential> implements SshVisitor {

    private final Connection    connection;
    private final int           defaultTimeout;

    public DefaultSshVisitor(ManagedNode node, Resource device, SshCredential credential, Connection connection, int defaultTimeout) {
        super(node, device, credential);
        this.connection = connection;
        this.defaultTimeout = defaultTimeout;
    }

    @Override
    public boolean isAvailable() {
        try {
            connection.ping();
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    @Override
    public String perform(String script, Object...args) throws SshException {
        return perform(defaultTimeout, script, args);
    }

    @Override
    public String perform(long timeout, String command, Object...args) throws SshException {
        Session session = null;
        try {
            long start = System.currentTimeMillis();
            session = connection.openSession();
            session.execCommand(command + " " + StringUtils.join(args, " "));

            int conditions = session.waitForCondition(EOF | CLOSED | EXIT_SIGNAL | EXIT_STATUS, timeout);
            logger.debug("Executed command [{}] exit code is {}", command, conditions);

            if ((conditions & TIMEOUT) != 0) {
                throw new IOException(String.format("Read timeout from the socket {%s}:{%s}, %d",
                                                    connection.getHostname(), connection.getPort(), timeout));
            }
            logger.debug("Took {}ms to execute {} against {}", System.currentTimeMillis() - start, command, this);

            if (session.getStdout().available() <= 0) {//可能有的命令执行返回就是空
                if (session.getStderr().available() > 0) {
                    return IOUtils.toString(session.getStderr());
                } else {
                    //命令执行完毕，但结果没传输回来，根据超时时间的设置，继续等待
                    while (session.getStdout().available() <= 0){
                        Thread.sleep(50);//以50ms的频度等待
                        if( System.currentTimeMillis() - start  > timeout ) break;
                    }
                    if( session.getStdout().available() > 0 ){
                        return IOUtils.toString(session.getStdout()).trim();
                    }
                }
                logger.error("Executed command [{}] but no stdout data received, conditions = {}", command, conditions);
                return "";
            }
            return IOUtils.toString(session.getStdout()).trim();
        } catch (IOException e) {
            logger.error("Session error: " + e.getMessage());
            throw new SshException(ErrorCodes.INTERNAL_ERROR, "Failed to perform " + command, e);
        } catch (Exception e) {
            String message = String.format("Send command: (%s) to server {%s}:{%s} failed",
                                          command, connection.getHostname(), connection.getPort());
            throw new SshException(ErrorCodes.INTERNAL_ERROR, message, e);
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    @Override
    public void close() {
        this.connection.close();
    }
}
