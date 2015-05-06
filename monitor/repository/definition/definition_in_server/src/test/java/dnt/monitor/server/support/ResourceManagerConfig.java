/**
 * Developer: Kadvin Date: 14/12/23 上午10:00
 */
package dnt.monitor.server.support;

import dnt.monitor.model.Resource;
import dnt.monitor.server.repository.ResourceRepository;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.support.ResourceManager;
import dnt.monitor.service.MetaService;
import net.happyonroad.component.core.ComponentContext;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>为 Link Repository层 提供的单元测试环境</h1>
 */
@Configuration
public class ResourceManagerConfig {
    @Bean
    public ResourceRepository<Resource> repository(){
        //noinspection unchecked
        return EasyMock.createMock(ResourceRepository.class);
    }

    @Bean
    public ComponentContext componentContext(){
        return EasyMock.createMock(ComponentContext.class);
    }

    @Bean
    public ResourceManager manager(){
        return new ResourceManager<Resource>(repository());
    }

    @Bean
    public MetaService metaService(){
        return EasyMock.createMock(MetaService.class);
    }

    @Bean
    public LinkService linkService(){
        return EasyMock.createMock(LinkService.class);
    }
}
