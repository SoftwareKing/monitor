/**
 * Developer: Kadvin Date: 15/3/11 上午9:18
 */
package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.discover.AbstractServiceDiscover;
import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Device;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.model.Service;
import dnt.monitor.service.SampleService;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.model.Credential;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.lang.time.DateUtils;

/**
 * <h1>The SSH Service Discover</h1>
 */
public class SshServiceDiscover extends AbstractServiceDiscover {
    static Service SERVICE = new Service("ssh", "tcp", 22);

    @Override
    public Service service() {
        return SERVICE;
    }

    @Override
    public int getOrder() {
        return HIGHEST_PRECEDENCE + 1000;
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof SshCredential ||
               credential instanceof LocalCredential;
    }

    @Override
    public int maxDiscoverTime(Device device) {
        // 1.5 minutes
        return (int) DateUtils.MILLIS_PER_SECOND * 90;
    }

    @Override
    public boolean isCredentialAvailable(ResourceNode node, Credential credential) {
        if (!(credential instanceof SshCredential)) return false;
        SshVisitor visitor = null;
        try {
            visitor = visitorOf(node, (SshCredential) credential);
            return true;
        } catch (DiscoveryException e) {
            logger.debug("Challenge {} by {} failed, because of {}",
                         node.getResource().getAddress(), credential, ExceptionUtils.getRootCauseMessage(e));
            return false;
        } finally {
            if (visitor != null) {
                SshVisitorFactory factory = applicationContext.getBean(SshVisitorFactory.class);
                factory.returnBack(node, visitor);
            }
        }
    }

    protected SshVisitor visitorOf(ResourceNode node, SshCredential credential) throws DiscoveryException {
        SshVisitorFactory factory = applicationContext.getBean(SshVisitorFactory.class);
        try {
            return factory.visitor(node, credential);
        } catch (SshException e) {
            throw new DiscoveryException("Can't get ssh visitor for " + node + " by " + credential, e);
        }
    }

    @Override
    public Device discover(ResourceNode node, Credential credential) throws DiscoveryException {
        SshVisitor visitor = visitorOf(node, (SshCredential) credential);
        String sysName;
        try {
            sysName = visitor.perform("uname");
        } catch (SshException e) {
            throw new DiscoveryException("Can't get system name ", e);
        }
        DeviceRecognizer recognizer = applicationContext.getBean(DeviceRecognizer.class);
        MetaResource metaModel = recognizer.recognizeBySystem(sysName);
        SampleService sampleService = applicationContext.getBean("sshSampleService", SampleService.class);
        try {
            return (Device) sampleService.sampleResource(node, metaModel);
        } catch (SampleException e) {
            throw new DiscoveryException("Failed to discovery " + node + " for " + metaModel, e);
        }
    }
}
