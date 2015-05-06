/**
 * Developer: Kadvin Date: 15/2/15 下午4:27
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.service.ConfigurationService;
import net.happyonroad.event.ObjectSavedEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>将System, Scope Node同步到新建的引擎中</h1>
 * <p/>
 * 当引擎被批准后，需要将root, infrastructure, system, engine, scope node 分配过去
 */
@Component
class AssignRelatedNodes2EngineAfterCreated extends Bean
        implements ApplicationListener<ObjectSavedEvent<MonitorEngine>> {
    @Autowired
    NodeService          nodeService;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    public AssignRelatedNodes2EngineAfterCreated() {
        setOrder(50);
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
        assignNode(engine, configurationService, rootNode);
        assignNode(engine, configurationService, infNode);
        assignNode(engine, configurationService, systemNode);
        assignEngineNode(engine, configurationService, (ResourceNode) engineNode);
        assignNode(engine, configurationService, scopeNode);
        try {
            //如果监控服务器归属于当前引擎，也分配下去
            ManagedNode serverNode = nodeService.findByPath(engine.getSystemPath() + "/server");
            //Server节点，唯一一个会将资源(server)下发给引擎的对象
            assignNode(engine, configurationService, serverNode);
        } catch (IllegalArgumentException e) {
            //skip it, because the server is not monitored by this engine
        }

    }

    private boolean isApproved(ObjectSavedEvent<MonitorEngine> event) {
        if( event instanceof ObjectUpdatedEvent)
        {
            ObjectUpdatedEvent<MonitorEngine> updatedEvent = (ObjectUpdatedEvent<MonitorEngine>) event;
            return MonitorEngine.isApproving(updatedEvent.getLegacySource(), updatedEvent.getSource());
        }
        else
            return event.getSource().isApproved();
    }

    protected void assignNode(MonitorEngine engine, ConfigurationService configurationService, ManagedNode node) {
        try {
            //监控引擎，监控服务器，这2个节点分配下去时，带上资源对象
            configurationService.assignNode(node);
        } catch (OfflineException e) {
            logger.debug("{} has been assigned to an offline {}", node, engine);
        } catch (EngineException e) {
            logger.warn("Can't assign {} to {}", node, engine);
        }
    }

    protected void assignEngineNode(MonitorEngine engine, ConfigurationService configurationService, ResourceNode node) {
        try {
            //监控引擎，监控服务器，这2个节点分配下去时，带上资源对象
            configurationService.assignNode(node);
        } catch (OfflineException e) {
            logger.debug("{} has been assigned to an offline {}", node, engine);
        } catch (EngineException e) {
            logger.warn("Can't assign {} to {}", node, engine);
        }
    }
}
