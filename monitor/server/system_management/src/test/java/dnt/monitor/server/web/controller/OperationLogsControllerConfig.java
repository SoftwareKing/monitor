package dnt.monitor.server.web.controller;

import dnt.monitor.server.service.OperationLogService;
import net.happyonroad.test.config.ApplicationControllerConfig;
import org.easymock.EasyMock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 为操作日志的控制层提供模拟的运行环境
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@Configuration
public class OperationLogsControllerConfig extends ApplicationControllerConfig
{
    @Bean
    public OperationLogService getOperationLogService() {
        return EasyMock.createMock(OperationLogService.class);
    }

    @Bean
    public OperationLogsController nodeController() {
        return new OperationLogsController();
    }
}
