package dnt.monitor.server.web.controller;

import dnt.monitor.server.service.MonitorLogService;
import net.happyonroad.test.config.ApplicationControllerConfig;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MonitorLogControllerConfig extends ApplicationControllerConfig {
    @Bean
    public MonitorLogService monitorLogServiceMock(){
        return EasyMock.createMock(MonitorLogService.class);
    }

    @Bean
    public MonitorLogsController monitorLogsController(){
        return new MonitorLogsController();
    }
}
