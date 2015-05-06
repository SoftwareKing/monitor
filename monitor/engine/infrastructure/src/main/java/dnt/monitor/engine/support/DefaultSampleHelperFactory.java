package dnt.monitor.engine.support;

import dnt.monitor.engine.service.SampleHelperFactory;
import dnt.monitor.engine.service.SampleService;
import dnt.monitor.engine.service.VisitorFactory;
import dnt.monitor.exception.EngineException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.service.MetaService;
import dnt.monitor.service.Visitor;
import net.happyonroad.model.Credential;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.spring.service.ServiceRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.OrderComparator;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * <h1>缺省的采集工厂</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultSampleHelperFactory extends ApplicationSupportBean implements SampleHelperFactory {

    @Autowired
    MetaService metaService;

    @Override
    public DefaultSampleHelper createHelper(ResourceNode node) {
        Resource resource = node.getResource();
        MetaResource model = metaService.getMetaResource(resource.getType());
        Credential[] credentials = node.getCredentials();
        //认证方式有优先级，譬如，优先使用本地方式，snmp方式
        OrderComparator.sort(credentials);

        //没有采用ServiceLoader机制，而是直接从服务注册表中获取
        ServiceRegistry registry = applicationContext.getBean(ServiceRegistry.class);
        Map<String, VisitorFactory> visitorFactoryMap = registry.getServices(VisitorFactory.class);
        List<VisitorFactory> factories = new LinkedList<VisitorFactory>(visitorFactoryMap.values());
        //访问方式也有优先级，与认证方式的优先次序类似
        OrderComparator.sort(factories);

        Map<String, SampleService> simpleMap = registry.getServices(SampleService.class);
        List<SampleService> sampleServices = new LinkedList<SampleService>(simpleMap.values());
        // 采集服务也有一个优先级,通用采集服务和专用采集服务放在一起比较
        OrderComparator.sort(sampleServices);

        for (Credential credential : credentials) {
            for (VisitorFactory factory : factories) {
                if (!factory.support(resource.getAddress())) continue;
                if (!factory.support(credential)) continue;
                Visitor visitor;
                try {
                    //noinspection unchecked
                    visitor = factory.visitor(node, credential);
                } catch (EngineException e) {
                    continue;
                }
                if (!visitor.isAvailable())  continue;
                SampleService  sampleService = initSampleService(sampleServices, visitor, model);
                return new DefaultSampleHelper(factory, visitor, sampleService);
            }
        }
        return null;
    }

    SampleService initSampleService(List<SampleService> services, Visitor visitor, MetaResource model) {
        for (SampleService sampleService : services) {
            if (!sampleService.support(visitor)) {
                continue;
            }
            if (!sampleService.support(model)) {
                continue;
            }
            return sampleService;
        }
        return null;
    }


}
