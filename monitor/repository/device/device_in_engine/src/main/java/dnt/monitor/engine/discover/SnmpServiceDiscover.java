/**
 * Developer: Kadvin Date: 15/3/11 上午9:18
 */
package dnt.monitor.engine.discover;

import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.engine.service.SampleService;
import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Device;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.Service;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.model.Credential;
import net.happyonroad.spring.service.ServiceRegistry;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.OrderComparator;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static org.apache.commons.lang.time.DateUtils.MILLIS_PER_SECOND;

/**
 * <h1>The SNMP Service Discover</h1>
 * <p/>
 * 由于其被Discovery Manager以服务的方式发现，而不是被Spring以组件的方式扫描构建；
 * 所以其必须为public， 且提供空构造函数
 */
@org.springframework.stereotype.Component
class SnmpServiceDiscover extends AbstractServiceDiscover {
    static Service SERVICE = new Service("snmp", "udp", 161);
    @Autowired
    SnmpVisitorFactory visitorFactory;
    @Autowired
    DeviceRecognizer   recognizer;
    @Autowired
    ServiceRegistry    serviceRegistry;


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
    public boolean isCredentialAvailable(GroupNode node, Device device, Credential credential) {
        MibAwareSnmpVisitor visitor = null;
        try {
            visitor = visitorOf(node, device, (SnmpCredential) credential);
            //判断是否可以连接，尝试30秒
            return visitor.isAvailable();
        } catch (Exception e) {
            logger.debug("Challenge {} by {} failed, because of {}",
                         device.getAddress(), credential, MiscUtils.describeException(e));
            return false;
        } finally {
            visitorFactory.returnBack(visitor);
        }
    }

    @Override
    public Device discover(GroupNode node, Device device, Credential credential) throws DiscoveryException {
        //当前类的application context 并不是当前组件的application context
        // 而是 DiscoverManager所在的组件的application context
        MibAwareSnmpVisitor visitor = visitorOf(node, device, (SnmpCredential) credential);
        String sysOid;
        try {
            // 在可以连接的情况下，10秒以内读取sys oid
            sysOid = (String) visitor.get(MILLIS_PER_SECOND * 10, "1.3.6.1.2.1.1.2.0");
        } catch (SnmpException e) {
            throw new DiscoveryException("Can't get the sysOid by " + visitor, e);
        }
        MetaResource metaModel = recognizer.recognizeByOID(sysOid);
        SampleService sampleService = sampleService(visitor, metaModel);
        try {
            return (Device) sampleService.sampleResource(visitor, metaModel);
        } catch (SampleException e) {
            throw new DiscoveryException("Failed to discovery " + device + " for " + metaModel, e);
        } finally {
            visitorFactory.returnBack(visitor);
        }
    }

    SampleService sampleService(MibAwareSnmpVisitor visitor, MetaResource metaModel) throws DiscoveryException {
        Map<String, SampleService> simples = serviceRegistry.getServices(SampleService.class);
        List<SampleService> sampleServices = new LinkedList<SampleService>(simples.values());
        OrderComparator.sort(sampleServices);
        for (SampleService service : sampleServices) {
            if (service.support(metaModel) && service.support(visitor)) {
                return service;
            }
        }
        throw new DiscoveryException("Can't find any sample service for " + metaModel + " using " + visitor);
    }

    protected MibAwareSnmpVisitor visitorOf(GroupNode node, Device device, SnmpCredential credential)
            throws DiscoveryException {
        try {
            return visitorFactory.visitor(node, device, credential);
        } catch (EngineException e) {
            throw new DiscoveryException("Can't get visitor ", e);
        }
    }
}
