/**
 * Developer: Kadvin Date: 15/1/1 下午7:16
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.MonitorServer;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.MonitorServerService;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * <h1>引擎创建后，设置/维护引擎对象的任务</h1>
 *
 * 当采集引擎被创建之后
 * <ol>
 * <li>如果是手工创建的，可能需要执行往目标主机安装相应采集引擎的任务；(具体根据用户输入情况)
 * <li>如果是安装后主动注册，需要为其建立到主机的关系；
 * <li>如果是第一个缺省引擎来注册，还需要监控服务器创建关系；
 * </ol>
 *
 * TODO 等支持 redis等应用模型之后，还需要建立 engine -use-> redis的关系
 */
@Component
class SetupServerNodeAfterEngineCreated extends Bean
        implements ApplicationListener<ObjectCreatedEvent<MonitorEngine>>{
    @Autowired
    ServiceLocator serviceLocator;

    @Autowired
    NodeService nodeService;

    @Autowired
    MonitorServerService serverService;

    public SetupServerNodeAfterEngineCreated() {
        setOrder(40);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<MonitorEngine> event) {
        MonitorEngine engine = event.getSource();
        Set<Integer> pids = engine.getPids();
        if (pids == null || pids.isEmpty() ){
            // 此时 engine 的主机也已经入库
            createManualInstallEngineTask(engine);
        }
        if( engine.isDefault() ){
            MonitorServer server = serverService.getServer();
            //在创建主机到其他对象的链路之前，应该先确保有主机管理节点存在
            ManagedNode serverNode = nodeService.findByResourceId(server.getId());
            if( serverNode == null ){
                String systemPath = engine.getSystemPath();
                ManagedNode systemNode = nodeService.findByPath(systemPath);
                serverNode = initServerNode(systemPath, server);
                try {
                    nodeService.create(systemNode, serverNode);
                } catch (NodeException e) {
                    throw new ApplicationContextException("Can't create server node", e);
                }
            }
        }
    }

    private void createManualInstallEngineTask(MonitorEngine engine) {
        if(engine.getHost() != null )
        {
            logger.info("Create manual install engine task on {} for {}", engine.getHost(), engine);
            //TODO create the manual task
        }
    }

    private ResourceNode initServerNode(String systemPath, MonitorServer server) {
        ResourceNode node = new ResourceNode();
        node.setResource(server);
        node.setPath(systemPath + "/server" );
        node.setLabel(server.getLabel());
        node.setIcon("monitor_server");
        node.setComment("The Monitor Server Node");
        node.setProperty("Creator", "By Default Engine");
        node.setState(State.Running);
        return node;
    }

}
