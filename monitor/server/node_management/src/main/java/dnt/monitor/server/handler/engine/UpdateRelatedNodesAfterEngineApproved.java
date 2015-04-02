/**
 * Developer: Kadvin Date: 15/1/14 上午9:26
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>引擎修改后，更新相应的管理节点</h1>
 * <p/>
 * 引擎注册时，系统自动为其Scope节点分配形如 /pending_n 的路径,
 * system节点分配形如: /infrastructure/pending_n的路径
 * 当管理员批准该引擎时，我们通过界面要求管理员为引擎分配一个新的path
 * 批准成功后，主要是修改相应管理节点的scope path
 */
@Component
class UpdateRelatedNodesAfterEngineApproved extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<MonitorEngine>> {
    @Autowired
    NodeService nodeService;

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<MonitorEngine> event) {
        MonitorEngine engine = event.getLegacySource();
        MonitorEngine newEngine = (MonitorEngine) ((ObjectUpdatedEvent) event).getSource();
        if (isApproving(engine, newEngine)) {
            String legacySystemPath = engine.getSystemPath();
            String systemPath = newEngine.getSystemPath();
            autoUpdateNodesForEngine(legacySystemPath, systemPath);
            String legacyScopePath = engine.getScopePath();
            String scopePath = newEngine.getScopePath();
            autoUpdateNodesForEngine(legacyScopePath, scopePath);
        } else if (isRejecting(engine, newEngine)) {
            logger.info("Perform some work after engine was rejected");
        }
    }

    // 当引擎被批准时，其路径也应该随着用户设定的新路径发生了变化，修改之
    // Topo节点也会自动随之而修改
    void autoUpdateNodesForEngine(String legacyPath, String path) {
        if (StringUtils.isNotBlank(path)) {
            try {
                nodeService.updateNodesPath(legacyPath, path);
            } catch (NodeException e) {
                logger.warn(e.getMessage(), e);
            }
        }
    }

    boolean isApproving(MonitorEngine oldEngine, MonitorEngine newEngine) {
        return (oldEngine.isRequesting()) && (newEngine.isApproved());

    }
    boolean isRejecting(MonitorEngine oldEngine, MonitorEngine newEngine) {
        return (oldEngine.isRequesting()) && (newEngine.isRejected());

    }
}
