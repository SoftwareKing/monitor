/**
 * Developer: Kadvin Date: 14/12/22 下午3:47
 */
package dnt.monitor.server;

import dnt.monitor.server.service.NodeService;
import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * 节点管理模块应用配置
 */
@Configuration
@Import({SystemUserConfig.class, EventUserConfig.class, ResourceUserConfig.class})
public class NodeAppConfig extends DefaultServerAppConfig {

    @Override
    public void doExports()  {
        exports(NodeService.class);
    }


}
