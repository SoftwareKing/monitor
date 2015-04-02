/**
 * Developer: Kadvin Date: 14/12/23 下午5:14
 */
package dnt.monitor.server;

import dnt.monitor.server.service.NodeService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>节点管理模块的使用者的应用配置</h1>
 */
@Configuration
public class NodeUserConfig extends AbstractUserConfig{
    @Bean
    public NodeService nodeService() {
        return imports(NodeService.class);
    }
}
