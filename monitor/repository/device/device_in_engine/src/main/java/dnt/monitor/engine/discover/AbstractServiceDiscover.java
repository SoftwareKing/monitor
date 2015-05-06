package dnt.monitor.engine.discover;

import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.engine.service.IpServiceDiscover;
import dnt.monitor.model.Device;
import dnt.monitor.model.GroupNode;
import net.happyonroad.model.Credential;
import net.happyonroad.spring.ApplicationSupportBean;

/**
 * <h1>Abstract Service Discover</h1>
 *
 * @author Jay Xiong
 */
public abstract class AbstractServiceDiscover extends ApplicationSupportBean implements IpServiceDiscover {
    @Override
    public int getOrder() {
        return 0;
    }

    @Override
    public boolean isCredentialAvailable(GroupNode node, Device device, Credential credential) {
        throw new UnsupportedOperationException("Not implemented to judge " + device + " by " + credential);
    }

    @Override
    public Device discover(GroupNode node, Device device, Credential credential) throws DiscoveryException {
        throw new UnsupportedOperationException("Not implemented to discover " + device + " by " + credential);
    }
}
