package dnt.monitor.engine.support;

import dnt.monitor.engine.service.IpServiceDiscover;
import dnt.monitor.exception.EngineException;
import dnt.monitor.model.Device;
import dnt.monitor.model.GroupNode;
import net.happyonroad.model.Credential;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * <h1>设备发现任务</h1>
 *
 * @author Jay Xiong
 */
public class DeviceDiscoveryTask extends Bean implements Callable<Device> {
    private final              GroupNode      node; //提供管理特征的节点，一般是上级节点，上面有各种控制参数
    private final              Device         device;
    private                    List<Pair>     discovers;

    public DeviceDiscoveryTask(GroupNode node, Device device) {
        this.node = node;
        this.device = device;
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
            if( discover.isCredentialAvailable(node, device, credential) ){
                try {
                    Device discovered = discover.discover(node, device, credential);
                    logger.info("Discovered {} -> {} by {} with {}, takes {}",
                                device,  discovered, discover, credential,
                                TimeInterval.parse(System.currentTimeMillis() - start));
                    return discovered;
                } catch (Exception e) {
                    causes.add(ExceptionUtils.getRootCauseMessage(e));
                    logger.warn("Failed to discovery {} by {} with {}, because of {}",
                                device, discover, credential, MiscUtils.describeException(e));
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
               "address=" + device.getAddress() +
               ",type=" +device.getClass().getSimpleName()+
               ",discovers=" + discovers +
               ')';
    }
}
