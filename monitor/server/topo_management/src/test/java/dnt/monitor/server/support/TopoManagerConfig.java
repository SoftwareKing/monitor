/**
 * Developer: Kadvin Date: 14/12/24 下午2:28
 */
package dnt.monitor.server.support;

import dnt.monitor.server.repository.TopoRepositoryConfig;
import net.happyonroad.component.core.ComponentContext;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Topo Manager Configuration</h1>
 */
@Configuration
@Import(TopoRepositoryConfig.class)
public class TopoManagerConfig extends TopoRepositoryConfig{
    @Bean
    public TopoManager topoManager(){
        return new TopoManager();
    }

    @Bean
    public ComponentContext componentContext(){
        return EasyMock.createMock(ComponentContext.class);
    }
}
