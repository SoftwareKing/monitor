/**
 * Developer: Kadvin Date: 15/1/1 下午7:16
 */
package dnt.monitor.server.handler.policy;

import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.ApproveStatus;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.policy.ResourcePolicy;
import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.server.service.EngineService;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.ServiceLocator;
import dnt.monitor.service.ConfigurationService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>将资源策略同步到所有的监控引擎</h1>
 */
@Component
class AssignPolicy2EngineAfterCreated extends Bean
        implements ApplicationListener<ObjectCreatedEvent<ResourcePolicy>> {
    @Autowired
    ServiceLocator       serviceLocator;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    public AssignPolicy2EngineAfterCreated() {
        setOrder(100);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<ResourcePolicy> event) {
        ResourcePolicy policy = event.getSource();
        EngineService engineService;
        try {
            engineService = (EngineService) serviceLocator.locate(MonitorEngine.class);
        } catch (ResourceException e) {
            throw new ApplicationContextException("Can't locate the monitor engine resource service", e);
        }
        List<MonitorEngine> engines = engineService.findAllByStatus(ApproveStatus.Approved);
        for (MonitorEngine engine : engines) {
            // get Engine NBI for resource service by factory bean
            ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
            try {
                //无论是ip range，还是具体节点，都分配过去，由引擎处理
                configurationService.createPolicy(policy);
            } catch (OfflineException e) {
                logger.debug("{} has been assigned to an offline {}", policy, engine);
            } catch (EngineException e) {
                logger.warn("Can't assign {} to {}", policy, engine);
            }
        }

    }

}
