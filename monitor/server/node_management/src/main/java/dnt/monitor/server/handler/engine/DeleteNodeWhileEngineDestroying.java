/**
 * Developer: Kadvin Date: 15/1/14 上午9:23
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>引擎注销前，将其管理节点(system, scope)删除</h1>
 */
@Component
class DeleteNodeWhileEngineDestroying extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<MonitorEngine>> {
    @Autowired
    NodeService nodeService;

    public DeleteNodeWhileEngineDestroying() {
        //晚于各种外围信息的清除，最后清除自身
        setOrder(100);
    }

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<MonitorEngine> event) {
        MonitorEngine engine = event.getSource();
        if( engine.isCascadeDeleting() ) return;
        autoDeleteNodeForEngine(engine);
    }

    void autoDeleteNodeForEngine(MonitorEngine engine) {
        //只负责清除自身的管理节点
        //引擎的监控范围的清除，由管理层自行完成
        String systemPath = engine.getSystemPath();
        String enginePath = systemPath + "/engine";
        ManagedNode engineNode = nodeService.findByPath(enginePath);
        try {
            engineNode.cascadeDeleting();
            nodeService.delete(engineNode);
        } catch (NodeException e) {
            throw new ApplicationContextException("Can't auto delete engine node " + enginePath, e);
        }
    }
}
