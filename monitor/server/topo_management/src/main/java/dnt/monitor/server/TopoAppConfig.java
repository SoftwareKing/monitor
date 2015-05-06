/**
 * Developer: Kadvin Date: 15/2/2 下午8:03
 */
package dnt.monitor.server;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Topo应用配置</h1>
 */
@Configuration
@Import({SystemUserConfig.class, NodeUserConfig.class})
public class TopoAppConfig extends DefaultServerAppConfig{
}
