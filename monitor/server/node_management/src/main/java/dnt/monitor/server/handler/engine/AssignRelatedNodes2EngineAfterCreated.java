/**
 * Developer: Kadvin Date: 15/2/15 下午4:27
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.EngineException;
import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.service.ConfigurationService;
import dnt.monitor.server.service.EngineServiceLocator;
import net.happyonroad.event.ObjectSavedEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>将System, Scope Node同步到新建的引擎中</h1>
 * <p/>
 * 当引擎被批准后，需要将system, engine, scope node 分配过去
 * root node不需要同步过去，root node的信息被合并在system/scope node上
 */
@Component
class AssignRelatedNodes2EngineAfterCreated extends Bean
        implements ApplicationListener<ObjectSavedEvent<MonitorEngine>> {
    @Autowired
    NodeService          nodeService;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    public AssignRelatedNodes2EngineAfterCreated() {
        setOrder(15);//after scope node created
    }

    @Override
    public void onApplicationEvent(ObjectSavedEvent<MonitorEngine> event) {
        if(!isApproved(event)) return;
        MonitorEngine engine = event.getSource();
        // get Engine NBI for resource service by factory bean
        ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
        ManagedNode rootNode = nodeService.findByPath(ManagedNode.ROOT_PATH);
        ManagedNode infNode = nodeService.findByPath(ManagedNode.INFRASTRUCTURE_PATH);
        ManagedNode scopeNode = nodeService.findByPath(engine.getScopePath());
        ManagedNode systemNode = nodeService.findByPath(engine.getSystemPath());
        ManagedNode engineNode = nodeService.findByPath(engine.getSystemPath() + "/engine");

        scopeNode.merge(rootNode);
        infNode.merge(rootNode);
        systemNode.merge(infNode);

        assignNode(engine, configurationService, systemNode);
        assignNode(engine, configurationService, engineNode);
        assignNode(engine, configurationService, scopeNode);
    }

    private boolean isApproved(ObjectSavedEvent<MonitorEngine> event) {
        if( event instanceof ObjectUpdatedEvent)
        {
            ObjectUpdatedEvent<MonitorEngine> updatedEvent = (ObjectUpdatedEvent<MonitorEngine>) event;
            return (updatedEvent.getLegacySource().isRequesting())
                    && (updatedEvent.getSource().isApproved());
        }
        else
            return event.getSource().isApproved();
    }

    protected void assignNode(MonitorEngine engine, ConfigurationService configurationService, ManagedNode node) {
        try {
            configurationService.assignNode(node);
        } catch (OfflineException e) {
            logger.debug("{} has been assigned to an offline {}", node, engine);
        } catch (EngineException e) {
            logger.warn("Can't assign {} to {}", node, engine);
        }
    }
}
