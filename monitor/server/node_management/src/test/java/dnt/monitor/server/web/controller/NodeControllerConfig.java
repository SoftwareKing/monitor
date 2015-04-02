/**
 * Developer: Kadvin Date: 14/12/22 下午1:00
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.server.service.EventService;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.test.config.ApplicationControllerConfig;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 节点管理模块的测试配置
 */
@Configuration
public class NodeControllerConfig extends ApplicationControllerConfig {
    ////////////////////////////////////////////////////////////////////////
    // Mocks
    ////////////////////////////////////////////////////////////////////////

    @Bean
    public NodeService nodeServiceMock(){
        return EasyMock.createMock(NodeService.class);
    }

    @Bean
    public EventService eventServiceMock(){
        return EasyMock.createMock(EventService.class);
    }

    ////////////////////////////////////////////////////////////////////////
    // Controllers
    ////////////////////////////////////////////////////////////////////////

    @Bean
    public NodeController nodeController(){
        return new NodeController();
    }

    @Bean
    public NodesController nodesController(){
        return new NodesController();
    }
}
