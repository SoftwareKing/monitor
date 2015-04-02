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
 * <h1>为 Node Repository层 提供的单元测试环境</h1>
 */
@Configuration
@Import(DatabaseConfig.class)
public class TopoRepositoryConfig extends RepositoryConfig {
    protected String dbRepository() {
        return "dnt.monitor.server.repository;";
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
                "classpath:META-INF/migrate/20141223085333_create_managed_nodes.sql@up",
                "classpath:META-INF/migrate/20141223071719_create_resources.sql@up",
                "classpath:META-INF/migrate/20141223071726_create_links.sql@up",
                "classpath:META-INF/migrate/20141223124248_create_components.sql@up",
                "classpath:META-INF/migrate/20141223171816_create_topo_maps.sql@up",
                "classpath:META-INF/migrate/20141223171821_create_topo_nodes.sql@up",
                "classpath:META-INF/migrate/20141223171825_create_topo_links.sql@up",
                "classpath:META-INF/migrate/20141223082405_insert_resources.sql@up",
                "classpath:META-INF/migrate/20141223082409_insert_links.sql@up",
                "classpath:META-INF/migrate/20141223091830_insert_managed_nodes.sql@up",
                "classpath:META-INF/migrate/20141223181253_insert_topo_maps.sql@up",
                "classpath:META-INF/migrate/20141223181257_insert_topo_nodes.sql@up",
                "classpath:META-INF/migrate/20141223181301_insert_topo_links.sql@up",
        };
    }
}
