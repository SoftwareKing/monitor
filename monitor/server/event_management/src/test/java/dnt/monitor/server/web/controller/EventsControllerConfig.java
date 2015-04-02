package dnt.monitor.server.web.controller;

import dnt.monitor.server.service.EventService;
import net.happyonroad.test.config.ApplicationControllerConfig;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 为事件的控制层提供模拟的运行环境
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@Configuration
public class EventsControllerConfig extends ApplicationControllerConfig
{
    @Bean
    public EventService getEventService() {
        return EasyMock.createMock(EventService.class);
    }

    @Bean
    public EventsController nodeController() {
        return new EventsController();
    }
}
