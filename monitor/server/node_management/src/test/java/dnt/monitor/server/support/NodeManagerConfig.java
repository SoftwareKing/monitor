/**
 * Developer: Kadvin Date: 14/12/22 下午1:00
 */
package dnt.monitor.server.support;

import dnt.monitor.server.repository.NodeRepository;
import dnt.monitor.server.service.ServerDiscoveryService;
import dnt.monitor.service.MetaService;
import dnt.monitor.server.service.ServiceLocator;
import net.happyonroad.component.core.ComponentContext;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 节点管理模块的测试配置
 */
@Configuration
public class NodeManagerConfig {
    ////////////////////////////////////////////////////////////////////////
    // Mocks
    ////////////////////////////////////////////////////////////////////////

    @Bean
    public NodeRepository  nodeRepositoryMock(){
        return EasyMock.createMock(NodeRepository.class);
    }

    @Bean
    public ServiceLocator resourceServiceLocator(){
        return EasyMock.createMock(ServiceLocator.class);
    }

    ////////////////////////////////////////////////////////////////////////
    // Beans to be tested
    ////////////////////////////////////////////////////////////////////////
    @Bean
    public NodeManager nodeManager(){
        return new NodeManager();
    }

    @Bean
    public ComponentContext componentContext(){
        return EasyMock.createMock(ComponentContext.class);
    }

    @Bean
    public MetaService metaService(){
        return EasyMock.createMock(MetaService.class);
    }

    @Bean
    public ServerDiscoveryService discoveryService(){
        return EasyMock.createMock(ServerDiscoveryService.class);
    }

}
