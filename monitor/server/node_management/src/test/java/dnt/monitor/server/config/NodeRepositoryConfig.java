/**
 * Developer: Kadvin Date: 14/12/23 上午10:00
 */
package dnt.monitor.server.config;

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
public class NodeRepositoryConfig  extends RepositoryConfig {
    @Autowired
    ApplicationContext context;

    @Override
    public void afterPropertiesSet() throws Exception {
        super.afterPropertiesSet();
        //由于单元测试环境不是将各个组件分开加载，而是混在一起
        // 当单元测试类先加载 HostRepository，没有将DeviceRepository作为实例预先加载过
        // 会导致 hostResult(extends deviceResult) 的这个映射由于 deviceResult在hostResult之后解析而不能解析成功
        // 测试环境出现这个问题的根本原因，还是我们的Repository体系设计上，
        // 各个Repository类，既可以作为实例服务，又可以作为下级类的父类
        //所以需要先构建/初始化以下 deviceRepository
        context.getBean("deviceRepository");
    }

    protected String dbRepository() {
        return "dnt.monitor.server.repository";
    }

    @Override
    protected String[] sqlScripts() {
        return new String[]{
                "classpath:META-INF/migrate/20141223071719_create_resources.sql@up",
                "classpath:META-INF/migrate/20141223071726_create_links.sql@up",
                "classpath:META-INF/migrate/20141223085333_create_managed_nodes.sql@up",
                "classpath:META-INF/migrate/20141223091830_insert_managed_nodes.sql@up",
        };
    }
}
