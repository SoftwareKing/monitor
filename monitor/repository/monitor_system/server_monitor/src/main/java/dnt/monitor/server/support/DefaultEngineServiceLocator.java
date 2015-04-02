/**
 * Developer: Kadvin Date: 15/1/21 下午1:55
 */
package dnt.monitor.server.support;

import dnt.monitor.server.model.EngineSession;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.EngineSessionService;
import dnt.monitor.server.util.EngineServiceProxyFactoryBean;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * <h1>缺省的引擎服务定位器</h1>
 */
@Component
class DefaultEngineServiceLocator extends Bean implements EngineServiceLocator {
    // Service Class -> {engineId -> Service Bean}
    Map<Class, Map<String, EngineServiceProxyFactoryBean>> instances = new HashMap<Class, Map<String, EngineServiceProxyFactoryBean>>();


    @Autowired
    EngineSessionService sessionService;


    @SuppressWarnings("unchecked")
    @Override
    public <T> T locate(MonitorEngine engine, Class<T> serviceKlass) {
        EngineSession session = sessionService.getEngineSession(engine);
        Map<String, EngineServiceProxyFactoryBean> engineId2ServiceMap = instances.get(serviceKlass);
        if (engineId2ServiceMap == null) {
            engineId2ServiceMap = new HashMap<String, EngineServiceProxyFactoryBean>();
            instances.put(serviceKlass, engineId2ServiceMap);
        }

        //noinspection unchecked
        EngineServiceProxyFactoryBean proxyFactoryBean = engineId2ServiceMap.get(engine.getEngineId());
        if (proxyFactoryBean == null) {
            logger.debug("Creating {} for {}", serviceKlass, engine);
            proxyFactoryBean = new EngineServiceProxyFactoryBean(session);
            proxyFactoryBean.setServiceInterface(serviceKlass);
            engineId2ServiceMap.put(engine.getEngineId(), proxyFactoryBean);
        } else{
            proxyFactoryBean.updateSession(session);
        }
        return (T) proxyFactoryBean.getObject();
    }
}
