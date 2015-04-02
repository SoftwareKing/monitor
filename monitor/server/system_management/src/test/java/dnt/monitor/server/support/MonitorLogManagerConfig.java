/**
 * Developer: Kadvin Date: 14/12/24 下午2:28
 */
package dnt.monitor.server.support;


import dnt.monitor.server.repository.MonitorLogRepositoryConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(MonitorLogRepositoryConfig.class)
public class MonitorLogManagerConfig extends MonitorLogRepositoryConfig {
    @Bean
    public MonitorLogManager monitorLogManager(){
        return new MonitorLogManager();
    }
}
