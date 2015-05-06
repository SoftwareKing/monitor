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
 * <h1>为 Link Repository层 提供的单元测试环境</h1>
 */
@Configuration
@Import(DatabaseConfig.class)
public class EngineRepositoryConfig extends RepositoryConfig {
    protected String dbRepository() {
        return "dnt.monitor.server.repository";
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
                "classpath:META-INF/migrate/20141223071719_create_resources.sql@up",
                "classpath:META-INF/migrate/20141223071726_create_links.sql@up",
                "classpath:META-INF/migrate/20141223124248_create_components.sql@up",
                "classpath:META-INF/migrate/20141224145302_create_devices.sql@up",
                "classpath:META-INF/migrate/20141225125557_create_hosts.sql@up",
                "classpath:META-INF/migrate/20141225125602_create_cpus.sql@up",
                "classpath:META-INF/migrate/20141225125608_create_memories.sql@up",
                "classpath:META-INF/migrate/20141224155616_create_nics.sql@up",
                "classpath:META-INF/migrate/20141225125623_create_partitions.sql@up",
                "classpath:META-INF/migrate/20141225173343_create_disks.sql@up",
                "classpath:META-INF/migrate/20150106162111_create_monitor_engines.sql@up",
                "classpath:META-INF/migrate/20141223082405_insert_resources.sql@up",
                "classpath:META-INF/migrate/20141223082409_insert_links.sql@up",
                "classpath:META-INF/migrate/20141226090640_insert_devices.sql@up",
                "classpath:META-INF/migrate/20141226090650_insert_hosts.sql@up",
                "classpath:META-INF/migrate/20141226090659_insert_cpus.sql@up",
                "classpath:META-INF/migrate/20141226090704_insert_memories.sql@up",
                "classpath:META-INF/migrate/20141226090709_insert_disks.sql@up",
                "classpath:META-INF/migrate/20141226090722_insert_partitions.sql@up",
                "classpath:META-INF/migrate/20141226090728_insert_nics.sql@up",
                "classpath:META-INF/migrate/20150106162213_insert_monitor_engines.sql@up",
        };
    }
}
