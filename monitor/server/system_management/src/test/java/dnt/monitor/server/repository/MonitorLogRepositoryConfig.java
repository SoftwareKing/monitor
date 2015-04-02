/**
 * Developer: Kadvin Date: 14/12/23 上午10:00
 */
package dnt.monitor.server.repository;

import net.happyonroad.platform.repository.DatabaseConfig;
import net.happyonroad.test.config.RepositoryConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>为 Monitor Log Repository层 提供的单元测试环境</h1>
 */
@Configuration
@Import(DatabaseConfig.class)
public class MonitorLogRepositoryConfig extends RepositoryConfig {
    protected String dbRepository() {
        return "dnt.monitor.server.repository;dnt.monitor.repository;";
    }

    @Autowired
    ApplicationContext context;


    @Override
    public void afterPropertiesSet() throws Exception {
        super.afterPropertiesSet();
        context.getBean("deviceRepository");
    }

    @Override
    protected String[] sqlScripts() {
        return new String[]{
                "classpath:META-INF/migrate/20141224150431_create_monitor_logs.sql@up",
                "classpath:META-INF/setup/insert_monitor_logs.sql"
        };
    }
}
