/**
 * Developer: Kadvin Date: 15/1/14 上午9:50
 */
package dnt.monitor.server.handler.resource;

import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.State;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>监听资源创建事件， 为其创建管理节点</h1>
 * 资源有两种主要创建方式：
 * <ul>
 * <li>通过界面创建，此时系统会先为资源创建管理节点，而后再创建资源节点；
 * 在这种情况下，该监听机制不应该起作用
 * <li>通过程序创建，如监控引擎发现资源之后，进行的创建活动
 * 例如：监控引擎注册时，创建自身，创建自身所在的主机等情况
 * 又如：监控引擎进行资源发现时，发现到的资源对象
 * 此时，系统需要根据该资源的creator来决定其放在哪个engine监控范围内
 * </ul>
 */
@Component
class CreateNodeAfterResourceCreated extends Bean
        implements ApplicationListener<ObjectCreatedEvent<Resource>> {
    @Autowired
    NodeService nodeService;

    public CreateNodeAfterResourceCreated() {
        setOrder(10);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<Resource> event) {
        Resource resource = event.getSource();
        if( resource instanceof MonitorEngine) {
            //监控引擎的处理与一般资源不同，由 EngineEventsHandler 处理
            //这里只处理一般性的资源
            return;
        }
        autoCreateNodeForResource(resource);
    }

    void autoCreateNodeForResource(Resource resource) {
        if( resource.isCascadeCreating()){
            //说明这个资源是在创建管理节点时自动创建的，不需要为其自动构建管理节点
            return;
        }
        String scopePath = resource.getProperty(Resource.PROPERTY_SCOPE_PATH);
        String systemPath = resource.getProperty(Resource.PROPERTY_SYSTEM_PATH);
        if(StringUtils.isNotBlank(systemPath)){
            // 说明这个资源属于基础架构
            createNode(resource, systemPath);
        }else if( StringUtils.isNotBlank(scopePath) ) {
            //说明这个资源属于普通被监控资源，已经被指定了所属路径
            createNode(resource, scopePath);
        }else {
            //说明这些资源不是引擎发现的，而是由界面主动创建的
            //skip it
            logger.debug("Doesn't auto create node for resource {}, which lack of scopePath or systemPath", resource);
        }
    }

    private void createNode(Resource resource, String parentPath){
        ManagedNode parentNode = nodeService.findByPath(parentPath);
        String relativePath = resource.getProperty(Resource.PROPERTY_RELATIVE_PATH);
        if( StringUtils.isBlank(relativePath) ){
            relativePath = Resource.convertAsPath(resource.getAddress());
        }
        String path = parentPath + "/" + relativePath;
        try {
            nodeService.findByPath(path);
        } catch (Exception e) {
            ResourceNode node = new ResourceNode();
            node.setResource(resource);
            node.setPath(path);
            node.setLabel(resource.getLabel());
            node.setIcon(mappingIcon(resource));
            // 新发现的资源，是不是要默认纳入监控呢？
            // TODO 以后可能根据当前上级节点(parentNode)的发现策略调整以下的逻辑
            if( resource.getClass() == Device.class ){
                //如果资源的类型未被识别(是Device.class)，则先不纳入监控
                node.setState(State.Stopped);
            }else {
                //否则已经识别的资源，就纳入监控
                node.setState(State.Running);
            }
            node.setComment("Auto created resource node for " + resource.getLabel());
            try {
                nodeService.create(parentNode, node);
            } catch (NodeException ex) {
                throw new ApplicationContextException("Can't auto create resource node", ex);
            }
        }
    }

    private String mappingIcon(Resource resource) {
        //TODO enhance dynamic mapping or meta info
        if(StringUtils.equalsIgnoreCase(resource.getType(), "/device/host/linux")) {
            return "linux";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/device/host/osx")){
            return "osx";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/device/host/windows")){
            return "windows";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/device/switch")){
            return "switch3";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/app/jvm/monitor/server")){
            return "monitor_server";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/app/jvm/monitor/engine")){
            return "monitor_engine";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/app/db/mysql")){
            return "mysql";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/app/nginx")){
            return "nginx";
        }else if(StringUtils.equalsIgnoreCase(resource.getType(), "/app/redis")){
            return "redis";
        }
        return "device";
    }
}
