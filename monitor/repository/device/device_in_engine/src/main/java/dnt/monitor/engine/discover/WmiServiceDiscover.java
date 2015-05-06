/**
 * Developer: Kadvin Date: 15/3/11 上午9:18
 */
package dnt.monitor.engine.discover;

import dnt.monitor.model.Device;
import dnt.monitor.model.Service;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.WindowsCredential;
import net.happyonroad.model.Credential;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.stereotype.Component;

/**
 * <h1>The WMI Service Discover</h1>
 */
@Component
class WmiServiceDiscover extends AbstractServiceDiscover {
    static Service SERVICE = new Service("wmi", "tcp", 135);

    @Override
    public Service service() {
        return SERVICE;
    }

    @Override
    public int getOrder() {
        return HIGHEST_PRECEDENCE + 2000;
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof WindowsCredential ||
               credential instanceof LocalCredential;
    }

    @Override
    public int maxDiscoverTime(Device device) {
        // 1 minutes
        return (int) DateUtils.MILLIS_PER_MINUTE;
    }
}
