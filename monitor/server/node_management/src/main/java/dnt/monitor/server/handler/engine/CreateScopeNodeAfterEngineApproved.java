/**
 * Developer: Kadvin Date: 15/1/14 上午9:18
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.type.TimeInterval;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Component;

/**
 * <h1>监听引擎被批准的事件， 为其创建相应的监控范围</h1>
 */
@Component
class CreateScopeNodeAfterEngineApproved extends EngineApprovalListener {
    @Autowired
    private NodeService nodeService;

    public CreateScopeNodeAfterEngineApproved() {
        setOrder(25);
    }

    @Override
    protected void onApprove(MonitorEngine engine, MonitorEngine... oldEngines) {
        ManagedNode root = nodeService.findByPath(ManagedNode.ROOT_PATH);
        //为监控引擎创建相应的管理范围（如果已经存在，则不用创建：防御性编程)
        findOrCreateScopeNode(engine, root);
    }

    GroupNode findOrCreateScopeNode(MonitorEngine engine, ManagedNode root) {
        // 创建引擎监控范围这个Group节点，存放所有被引擎监控的资源
        GroupNode engineScopeNode;
        try {
            return (GroupNode) nodeService.findByPath(engine.getScopePath());
        } catch (IllegalArgumentException e) {
            // Not found exception
            engineScopeNode = new GroupNode();
            engineScopeNode.cascadeCreating();
            engineScopeNode.setPath(engine.getScopePath());
            engineScopeNode.setLabel(engine.getLabel() + "的监控范围");
            engineScopeNode.setIcon("monitor_group");
            engineScopeNode.setComment("Auto created monitor group node for " + engine.getLabel());
            //被某个引擎监控的所有对象，默认以5分钟的频度进行监控
            engineScopeNode.setFrequency(new TimeInterval("5m"));
            //监控计划不设置，等于全年监控
            try {
                return (GroupNode) nodeService.create(root, engineScopeNode);
            } catch (NodeException ex) {
                throw new ApplicationContextException("Can't auto create engine group node", ex);
            }
        }
    }
}
