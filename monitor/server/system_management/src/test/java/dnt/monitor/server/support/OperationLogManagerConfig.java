package dnt.monitor.server.support;

import dnt.monitor.server.repository.OperationLogRepositoryConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * 为操作日志的业务层提供模拟的运行环境
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@Configuration
@Import(OperationLogRepositoryConfig.class)
public class OperationLogManagerConfig extends OperationLogRepositoryConfig
{
    @Bean
    public OperationLogManager operationLogManager() {
        return new OperationLogManager();
    }
}
