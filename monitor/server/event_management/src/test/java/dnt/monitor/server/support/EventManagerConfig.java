package dnt.monitor.server.support;

import dnt.monitor.server.config.EventRepositoryConfig;
import net.happyonroad.component.core.ComponentContext;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * 为事件的业务层提供模拟的运行环境
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@Configuration
@Import(EventRepositoryConfig.class)
public class EventManagerConfig extends EventRepositoryConfig
{
    @Bean
    public EventManager getEventManager() {
        return new EventManager();
    }

    @Bean
    public ComponentContext componentContext(){
        return EasyMock.createMock(ComponentContext.class);
    }
}
