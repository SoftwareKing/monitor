/**
 * Developer: Kadvin Date: 15/1/1 下午7:16
 */
package dnt.monitor.server.handler.node;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Host;
import dnt.monitor.model.LinkType;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.service.HostService;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>清理采集引擎</h1>
 * 当采集引擎被销毁之前
 * <p/>
 * 需要检查其上是否还有资源采集任务，如果没有了，则需要先通知其相关事件，要求其停止；
 * 而后试图删除引擎所使用的应用(redis)，所在的主机
 */
@Component
class TeardownHostWhileEngineNodeDestroying extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<ResourceNode>> {
    @Autowired
    ServiceLocator serviceLocator;

    public TeardownHostWhileEngineNodeDestroying() {
        //早于引擎自身模型的清除，先把引擎所在的主机/关系（这样的外围信息）清理干净
        setOrder(10);
    }

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<ResourceNode> event) {
        if( !(event.getSource().isEngineNode() )) return;
        MonitorEngine engine = (MonitorEngine) event.getSource().getResource();
        logger.debug("Heard engine {} is destroying", engine);
        try {
            //TODO cleanupEngineRelates
            cleanupEngineHost(engine);
        } catch (ResourceException e) {
            throw new ApplicationContextException("Can't cleanup engine host", e);
        }
        logger.info("I will check other resources and task on this engine");
        //TODO perform other works
    }

    void cleanupEngineHost(MonitorEngine engine) throws ResourceException {
        Host host = engine.getHost();
        // TODO 如果是默认引擎所在的主机，其还与监控服务器，以及其他应用存在RunAt关系这些关系还没清除掉
        //  最终逻辑，应该是监控引擎删除/尝试删除所依赖的组件（存在server的情况下删除不掉）
        //  而后删除 引擎 + 主机的 RunAt关系
        //  尝试删除主机（但是由于未能将server, mysql, redis等组件删除，所以主机存在关系，无法删除）
        if (host != null) {
            LinkService linkService = serviceLocator.locateLinkService(LinkType.RunOn.name());
            if (linkService == null)
                throw new IllegalStateException("Can't find link service for link type = " + LinkType.RunOn);
            linkService.unlink(engine, host, LinkType.RunOn);
            //noinspection unchecked
            HostService<Host> hostService = (HostService<Host>) serviceLocator.locate(host.getType());
            try{
                hostService.delete(host);
            }catch (ResourceException e){
                logger.warn("Can't delete the engine host, because of there are some legacy links ", e);
            }
        }
    }
}
