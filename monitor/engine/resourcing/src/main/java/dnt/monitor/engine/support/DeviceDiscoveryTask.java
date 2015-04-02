package dnt.monitor.engine.support;

import dnt.monitor.engine.service.IpServiceDiscover;
import dnt.monitor.exception.EngineException;
import dnt.monitor.model.Device;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.model.Credential;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

/**
 * <h1>设备发现任务</h1>
 *
 * @author Jay Xiong
 */
public class DeviceDiscoveryTask extends Bean implements Callable<Device> {
    private final              ResourceNode   node;
    private final              Device         device;
    private                    List<Pair>     discovers;
    private transient volatile Future<Device> future;

    public DeviceDiscoveryTask(ResourceNode node) {
        this.node = node;
        this.device = (Device) node.getResource();
    }

    public Device getDevice() {
        return device;
    }

    public void addDiscover(IpServiceDiscover discover, Credential credential) {
        if (discovers == null) discovers = new ArrayList<Pair>(2);
        discovers.add(new Pair(discover, credential));
    }

    public boolean hasDiscovers() {
        return discovers != null && !discovers.isEmpty();
    }

    @Override
    public Device call() throws Exception {
        long start = System.currentTimeMillis();
        StringBuilder credentials = new StringBuilder();
        List<String> causes = new ArrayList<String>();
        for (Pair pair : discovers) {
            IpServiceDiscover discover = pair.discover;
            Credential credential = pair.credential;
            if( discover.isCredentialAvailable(node, credential) ){
                try {
                    Device discovered = discover.discover(node, credential);
                    logger.info("Discovered {} -> {} by {} with {}, takes {}",
                                device,  discovered, discover, credential,
                                TimeInterval.parse(System.currentTimeMillis() - start));
                    return discovered;
                } catch (Exception e) {
                    causes.add(ExceptionUtils.getRootCauseMessage(e));
                    logger.warn("Failed to discovery {} by {} with {}, because of {}",
                                device, discover, credential, ExceptionUtils.getRootCauseMessage(e));
                }
            }else {
                credentials.append(pair.credential).append(",");
            }
        }
        if( causes.isEmpty() ){
            throw new EngineException("Tried " + credentials + " and are not any credentials available for " + device);
        } else{
            throw new EngineException("Failed to discover " + device + " because of " + StringUtils.join(causes, ";"));
        }
    }

    /**
     * <h2>计算该任务的超时时间(最大)</h2>
     *
     * @return 最大超时时间，单位为毫秒
     */
    public int computeTimeout() {
        int timeout = 0;
        for (Pair pair : discovers) {
            timeout = pair.discover.maxDiscoverTime(device);
        }
        return timeout;
    }

    static class Pair {
        IpServiceDiscover discover;
        Credential credential;

        public Pair(IpServiceDiscover discover, Credential credential) {
            this.discover = discover;
            this.credential = credential;
        }

        @Override
        public String toString() {
            return discover.getClass().getSimpleName() + "@" + credential.getClass().getSimpleName();
        }
    }

    @Override
    public String toString() {
        return "Device Discovery Task(" +
               "path=" + node.getPath() +
               ",type=" +device.getClass().getSimpleName()+
               ",discovers=" + discovers +
               ')';
    }
}
