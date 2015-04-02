/**
 * Developer: Kadvin Date: 15/1/1 下午7:16
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.service.ConfigurationService;
import dnt.monitor.server.service.EngineServiceLocator;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>The node destroyed event process</h1>
 * 当资源被销毁之前，需要将其从对应的采集引擎回收
 * <p/>
 * <ol>
 * <li>如果被销毁的是普通资源：则需要通知采集引擎回收该资源对象，以及其上所有其他相关对象
 * </ol>
 */
@Component
class RevokeNodeFromEngineBeforeDestroy extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<ManagedNode>> {
    @Autowired
    NodeService nodeService;
    @Autowired
    EngineServiceLocator engineServiceLocator;

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<ManagedNode> event) {
        ManagedNode node = event.getSource();
        if (node instanceof GroupNode) {
            //所有其下的资源节点都应该已经发出了删除事件
            return;
        }
        // deal IpRange also
        MonitorEngine engine;
        try {
            engine = nodeService.findEngineByNode(node);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't find engine for " + node);
        }
        if (engine.isRejected() ){
            logger.debug("The engine is rejected, do not revoke any node from it");
            return;
        }
        // get Engine NBI for resource service by factory bean
        ConfigurationService configurationService = engineServiceLocator.locate(engine, ConfigurationService.class);
        if (node instanceof ResourceNode && ((ResourceNode)node).isEngineNode()) {
            return; // other handle has proceed this type
        }
        try {
            configurationService.revokeNode(node);
        } catch (EngineException e) {
            logger.warn("Can't revoke {} from {}, because of {}", node, engine, e.getMessage());
            //TODO 实际代码应该是将该node设置为未同步状态，而后有其他的代码/任务负责定期将该range信息同步给相应的引擎
        }
    }
}
