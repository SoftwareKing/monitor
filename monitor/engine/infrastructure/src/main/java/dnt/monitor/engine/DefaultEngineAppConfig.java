/**
 * Developer: Kadvin Date: 15/2/3 下午3:02
 */
package dnt.monitor.engine;

import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>Engine 模块的缺省应用配置</h1>
 */
@Configuration
@Import(InfrastructureUserConfig.class)
@ComponentScan({"dnt.monitor.engine.support","dnt.monitor.engine.handler"})
public class DefaultEngineAppConfig extends AbstractAppConfig{
}
