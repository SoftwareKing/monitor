package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.policy.ResourcePolicy;
import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.PolicyService;
import dnt.monitor.service.ConfigurationService;
import net.happyonroad.event.ObjectSavedEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.MiscUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>引擎被批准之后，将所有的策略同步过去</h1>
 *
 * @author Jay Xiong
 */
@Component
class SyncPolicies2EngineAfterApproved extends Bean
        implements ApplicationListener<ObjectSavedEvent<MonitorEngine>> {
    @Autowired
    PolicyService        service;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    // Before AssignRelatedNodes2EngineAfterCreated
    public SyncPolicies2EngineAfterApproved() {
        setOrder(10);
    }

    @Override
    public void onApplicationEvent(ObjectSavedEvent<MonitorEngine> event) {
        if (event instanceof ObjectUpdatedEvent) {
            ObjectUpdatedEvent<MonitorEngine> updatedEvent = (ObjectUpdatedEvent<MonitorEngine>) event;
            if (MonitorEngine.isApproving(updatedEvent.getLegacySource(), updatedEvent.getSource())) {
                onApproved(updatedEvent.getSource());
            }
        } else {
            if (event.getSource().isApproved()) {
                onApproved(event.getSource());
            }
        }

    }

    private void onApproved(MonitorEngine engine) {
        ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
        List<ResourcePolicy> policies = service.findAll();
        for (ResourcePolicy policy : policies) {
            try {
                configurationService.createPolicy(policy);
            } catch (OfflineException e) {
                logger.debug("The {} is offline, {} will be sent when it's online", engine, policy);
            } catch (EngineException e) {
                logger.error("Can't sync policy service {} to {}, because of {}",
                             policy, engine, MiscUtils.describeException(e));
            }
        }
    }
}
