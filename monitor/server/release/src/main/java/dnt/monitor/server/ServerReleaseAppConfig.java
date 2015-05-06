/**
 * Developer: Kadvin Date: 14/12/16 下午4:43
 */
package dnt.monitor.server;

import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * 监控服务器的整体应用配置
 */
@Configuration
@Import({SystemUserConfig.class})
public class ServerReleaseAppConfig extends DefaultServerAppConfig{
    // Import for profile controller
    @Bean
    UserDetailsService userDetailsService(){
        return imports(UserDetailsService.class, "operator");
    }
}

