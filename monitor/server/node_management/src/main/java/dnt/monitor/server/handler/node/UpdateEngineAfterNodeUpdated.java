/**
 * Developer: Kadvin Date: 15/1/27 下午9:20
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.server.service.EngineService;
import dnt.monitor.server.service.EngineServiceLocator;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.server.service.ServiceLocator;
import dnt.monitor.service.ConfigurationService;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>当指向资源的管理节点被更新时，为其更新资源信息</h1>
 * 当用户(管理员)更新管理节点时，如果其资源节点被修改了，则首先更新之
 */
@Component
class UpdateEngineAfterNodeUpdated extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<ManagedNode>> {
    @Autowired
    ServiceLocator serviceLocator;
    @Autowired
    NodeService nodeService;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<ManagedNode> event) {
        ManagedNode node = event.getSource();
        // 如果是根节点， infrastructure 被修改，则需要将同步给所有被批准的engine
        if (node.isRoot() ||  node.isInfrastructure() ) {
            syncNodeToAllEngine(node);
        } else {
            syncNodeToEngine(node, event.getLegacySource());
        }
    }

    void syncNodeToEngine(ManagedNode node, ManagedNode legacy) {
        MonitorEngine engine;
        try {
            engine = nodeService.findEngineByNode(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't find engine for " + node);
        }
        if( engine.isRequesting()) {
            logger.debug("The engine is not approved, do not sync any node to it");
            return;
        }else if (engine.isRejected() ){
            logger.debug("The engine is rejected, do not sync any node to it");
            return;
        }
        Resource resource = null;
        // get Engine NBI for resource service by factory bean
        ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
        try {
            //分配节点时，不将resource发送过去
            if (node instanceof ResourceNode) {
                resource = ((ResourceNode) node).getResource();
                ((ResourceNode) node).setResource(null);
            }
            if(!StringUtils.equals(node.getPath(), legacy.getPath())){
                // move node
                configurationService.moveNode(legacy.getPath(), node);
            }else{
                //无论是ip range，还是具体节点，都分配过去，由引擎处理
                configurationService.updateNode(node);
            }
        } catch (OfflineException e) {
            logger.warn("Sync {} to {} later", node, engine);
        } catch (EngineException e) {
            logger.warn("Can't sync {} to {}, because of {}", node, engine, MiscUtils.describeException(e));
        }  finally {
            if( node instanceof ResourceNode &&  resource != null ){
                ((ResourceNode) node).setResource(resource);
            }
        }

    }

    void syncNodeToAllEngine(ManagedNode node) {
        EngineService engineService;
        try {
            engineService = (EngineService) serviceLocator.locate(MonitorEngine.class);
        } catch (ResourceException e) {
            throw new ApplicationContextException("Can't locate EngineService", e);
        }
        List<MonitorEngine> approvedEngines = engineService.findAllByStatus(ApproveStatus.Approved);
        for (MonitorEngine engine : approvedEngines) {
            // get Engine NBI for resource service by factory bean
            ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
            try {
                configurationService.updateNode(node);
            } catch (OfflineException e) {
                logger.warn("Sync {} to {} later", node, engine);
            } catch (EngineException e) {
                logger.warn("Can't sync {} to {}, because of {}", node, engine, MiscUtils.describeException(e));
            }
        }
    }
}
