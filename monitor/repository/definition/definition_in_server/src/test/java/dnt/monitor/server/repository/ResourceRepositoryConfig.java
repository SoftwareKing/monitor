/**
 * Developer: Kadvin Date: 14/12/23 上午10:00
 */
package dnt.monitor.server.repository;

import net.happyonroad.platform.repository.DatabaseConfig;
import net.happyonroad.test.config.RepositoryConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>为 Link Repository层 提供的单元测试环境</h1>
 */
@Configuration
@Import(DatabaseConfig.class)
public class ResourceRepositoryConfig extends RepositoryConfig {
    protected String dbRepository() {
        return "dnt.monitor.server.repository";
    }

    @Override
    protected String[] sqlScripts() {
        return new String[]{
                "classpath:META-INF/migrate/20141223071719_create_resources.sql@up",
                "classpath:META-INF/migrate/20141223071726_create_links.sql@up",
                "classpath:META-INF/migrate/20141223082405_insert_resources.sql@up",
                "classpath:META-INF/migrate/20141223082409_insert_links.sql@up"
        };
    }
}
