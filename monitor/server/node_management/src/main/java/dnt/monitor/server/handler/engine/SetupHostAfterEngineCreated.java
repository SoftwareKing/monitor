/**
 * Developer: Kadvin Date: 15/1/1 下午7:16
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.server.service.HostService;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.MonitorServerService;
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
 * <li>如果是手工创建的，则需要执行往目标主机安装相应采集引擎的任务；
 * <li>如果是安装后主动注册，需要为其建立到主机的关系；
 * <li>如果是第一个缺省引擎来注册，还需要监控服务器创建关系；
 * </ol>
 *
 * TODO 等支持 redis等应用模型之后，还需要建立 engine -use-> redis的关系
 */
@Component
class SetupHostAfterEngineCreated extends Bean
        implements ApplicationListener<ObjectCreatedEvent<MonitorEngine>>{
    @Autowired
    ServiceLocator serviceLocator;

    @Autowired
    NodeService nodeService;

    @Autowired
    MonitorServerService serverService;

    public SetupHostAfterEngineCreated() {
        // After AutoCreateNodeAfterEngine(10)
        setOrder(20);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<MonitorEngine> event) {
        MonitorEngine engine = event.getSource();
        Set<Integer> pids = engine.getPids();
        if (pids == null || pids.isEmpty() ){
            // 此时 engine 的主机也已经入库
            createManualInstallEngineTask(engine);
        }else{
            // 有进程的engine，说明是自动注册的，需要与主机建立关系
            try {
                Host host = setupEngineHost(engine);
                if( engine.isDefault() && host != null )
                    setupServerHost(host);
            } catch (ResourceException e) {
                throw new ApplicationContextException("Can't setup engine/server run on its host", e);
            }
        }
    }

    private Host setupEngineHost(MonitorEngine engine) throws ResourceException {
        Host host = engine.getHost();
        //对于引擎所在的主机，其监控的连接方式可以为本地，而无需snmp/ssh/windows等参数
        if (host != null) {
            //自动创建engine所在的主机
            //noinspection unchecked
            HostService<Host> hostService = (HostService<Host>) serviceLocator.locateResourceService(host.getType());
            String systemPath = engine.getSystemPath();
            host.setProperty(Resource.PROPERTY_SYSTEM_PATH, systemPath);
            host.setProperty(Resource.PROPERTY_RELATIVE_PATH, Resource.convertAsPath(host.getAddress()));
            Host createdHost = hostService.create(host);

            LinkService linkService = serviceLocator.locateLinkService(LinkType.RunOn.name());
            if (linkService == null)
                throw new IllegalStateException("Can't find link service for link type = " + LinkType.RunOn);
            //engine与其所在的主机建立 RunOn   关系
            linkService.link(engine, createdHost, LinkType.RunOn);
            return createdHost;
        }else {
            return null;
        }

    }

    private void setupServerHost(Host host) throws ResourceException {
        MonitorServer server = serverService.getServer();
        //在创建主机到其他对象的链路之前，应该先确保有主机管理节点存在
        ManagedNode serverNode = nodeService.findByResourceId(server.getId());
        if( serverNode == null ){
            String systemPath = host.getProperty(Resource.PROPERTY_SYSTEM_PATH);
            ManagedNode systemNode = nodeService.findByPath(systemPath);
            serverNode = initServerNode(systemPath, server);
            try {
                nodeService.create(systemNode, serverNode);
            } catch (NodeException e) {
                throw new ApplicationContextException("Can't create server node", e);
            }
        }
        LinkService linkService = serviceLocator.locateLinkService(LinkType.RunOn.name());
        if (linkService == null)
            throw new IllegalStateException("Can't find link service for link type = " + LinkType.RunOn);
        //Server与其所在的主机建立 RunOn   关系
        linkService.link(server, host, LinkType.RunOn);
        server.setHost(host);
        serverService.updateServer(server);
    }

    private void createManualInstallEngineTask(MonitorEngine engine) {
        logger.info("Create manual install engine task on {} for {}", engine.getHost(), engine);
        //TODO create the manual task
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
