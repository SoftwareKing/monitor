/**
 * Developer: Kadvin Date: 15/3/11 上午9:18
 */
package dnt.monitor.engine.discover;

import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.engine.exception.ShellException;
import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Device;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.Service;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.model.Credential;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

/**
 * <h1>The SSH Service Discover</h1>
 */
@org.springframework.stereotype.Component
class SshServiceDiscover extends AbstractServiceDiscover {
    static Service SERVICE = new Service("ssh", "tcp", 22);
    @Autowired
    SshVisitorFactory    factory;
    @Autowired
    DeviceRecognizer  recognizer;
    @Autowired
    @Qualifier("shellSampleService")
    GenericSampleService sampleService;

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
        return credential instanceof SshCredential;
    }

    @Override
    public int maxDiscoverTime(Device device) {
        // 1.5 minutes
        return (int) DateUtils.MILLIS_PER_SECOND * 90;
    }

    @Override
    public boolean isCredentialAvailable(GroupNode node, Device device, Credential credential) {
        SshVisitor visitor = null;
        try {
            visitor = visitorOf(node, device, (SshCredential) credential);
            return visitor.isAvailable();
        } catch (DiscoveryException e) {
            logger.debug("Challenge {} by {} failed, because of {}",
                         device.getAddress(), credential, MiscUtils.describeException(e));
            return false;
        } finally {
            if (visitor != null) {
                factory.returnBack(visitor);
            }
        }
    }

    @Override
    public Device discover(GroupNode node, Device device, Credential credential) throws DiscoveryException {
        SshVisitor visitor = visitorOf(node, device, (SshCredential) credential);
        String sysName;
        try {
            sysName = visitor.perform("uname");
        } catch (ShellException e) {
            throw new DiscoveryException("Can't get system name ", e);
        } finally {
            factory.returnBack(visitor);
        }
        MetaResource metaModel = recognizer.recognizeBySystem(sysName);
        try {
            return (Device) sampleService.sampleResource(visitor, metaModel);
        } catch (SampleException e) {
            throw new DiscoveryException("Failed to discovery " + node + " for " + metaModel, e);
        }  finally {
            factory.returnBack(visitor);
        }
    }

    protected SshVisitor visitorOf(GroupNode node, Device device, SshCredential credential) throws DiscoveryException {
        try {
            return factory.visitor(node, device, credential);
        } catch (Exception e) {
            throw new DiscoveryException("Can't get ssh visitor for " + device + " by " + credential, e);
        }
    }
}
