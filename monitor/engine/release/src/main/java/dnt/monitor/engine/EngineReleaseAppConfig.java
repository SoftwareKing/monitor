/**
 * Developer: Kadvin Date: 14/12/16 下午4:43
 */
package dnt.monitor.engine;

import net.happyonroad.CacheUserConfig;
import net.happyonroad.MessagingUserConfig;
import net.happyonroad.UtilUserConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * 监控引擎的整体应用配置
 */
@Configuration
@Import({UtilUserConfig.class, CacheUserConfig.class, MessagingUserConfig.class})
public class EngineReleaseAppConfig extends DefaultEngineAppConfig{


}

