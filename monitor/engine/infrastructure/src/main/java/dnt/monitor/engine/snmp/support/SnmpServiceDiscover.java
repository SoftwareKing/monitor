/**
 * Developer: Kadvin Date: 15/3/11 上午9:18
 */
package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.discover.AbstractServiceDiscover;
import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.snmp.SnmpVisitor;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Device;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.model.Service;
import dnt.monitor.service.SampleService;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.model.Credential;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.lang.time.DateUtils;

import static org.apache.commons.lang.time.DateUtils.MILLIS_PER_SECOND;

/**
 * <h1>The SNMP Service Discover</h1>
 */
public class SnmpServiceDiscover extends AbstractServiceDiscover {
    static Service SERVICE = new Service("snmp", "udp", 161);
    @Override
    public Service service() {
        return SERVICE;
    }

    @Override
    public int getOrder() {
        return HIGHEST_PRECEDENCE;
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof SnmpCredential;
    }

    @Override
    public int maxDiscoverTime(Device device) {
        // 2 minutes
        return (int) DateUtils.MILLIS_PER_MINUTE * 2;
    }

    @Override
    public boolean isCredentialAvailable(ResourceNode node, Credential credential) {
        if( !(credential instanceof SnmpCredential ))
            return false;
        SnmpVisitor visitor = visitorOf(node, (SnmpCredential) credential);
        try {
            //判断是否可以连接，尝试30秒
            visitor.get("1.3.6.1.2.1.1.1.0", MILLIS_PER_SECOND * 30);
            return true;
        } catch (SnmpException e) {
            logger.debug("Challenge {} by {} failed, because of {}",
                         node.getResource().getAddress(), credential, ExceptionUtils.getRootCauseMessage(e));
            return false;
        }
    }

    @Override
    public Device discover(ResourceNode node, Credential credential) throws DiscoveryException {
        //当前类的application context 并不是当前组件的application context
        // 而是 DiscoverManager所在的组件的application context
        SnmpVisitor visitor = visitorOf(node, (SnmpCredential) credential);
        String sysOid;
        try {
            // 在可以连接的情况下，10秒以内读取sys oid
            sysOid = (String)visitor.get("1.3.6.1.2.1.1.2.0", MILLIS_PER_SECOND * 10);
        } catch (SnmpException e) {
            throw new DiscoveryException("Can't get the sysOid by " + visitor, e );
        }
        DeviceRecognizer recognizer = applicationContext.getBean(DeviceRecognizer.class);
        MetaResource metaModel = recognizer.recognizeByOID(sysOid);
        //当前所取得sample service，为针对 Device的临时模拟对象
        SampleService sampleService = applicationContext.getBean("snmpSampleService", SampleService.class);
        try {
            return (Device) sampleService.sampleResource(node, metaModel);
        } catch (SampleException e) {
            throw new DiscoveryException("Failed to discovery " + node + " for " + metaModel, e);
        }
    }

    protected SnmpVisitor visitorOf(ResourceNode node, SnmpCredential credential) {
        SnmpVisitorFactory factory = applicationContext.getBean(SnmpVisitorFactory.class);
        return factory.visitor(node, credential);
    }
}
