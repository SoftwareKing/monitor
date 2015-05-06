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
 * <h1>为Policy Repository层 提供的单元测试环境</h1>
 */
@Configuration
@Import(DatabaseConfig.class)
public class PolicyRepositoryConfig extends RepositoryConfig {
    protected String dbRepository() {
        return "dnt.monitor.server.repository";
    }

    @Autowired
    ApplicationContext context;

    @Override
    protected String[] sqlScripts() {
        return new String[]{
                "classpath:META-INF/migrate/20150413133529_create_resource_policies.sql@up",
                "classpath:META-INF/migrate/20150413133538_create_component_policies.sql@up",
                "classpath:META-INF/migrate/20150413140158_insert_policies.sql@up"
        };
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        super.afterPropertiesSet();
        context.getBean("deviceRepository");
    }
}
