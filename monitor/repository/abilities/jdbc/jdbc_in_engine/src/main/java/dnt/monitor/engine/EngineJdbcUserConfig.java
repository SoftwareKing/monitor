package dnt.monitor.engine;

import dnt.monitor.engine.jdbc.JdbcVisitorFactory;
import dnt.monitor.engine.service.GenericSampleService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>Database Repository in Engine side User Configuration</h1>
 *
 * @author Jay Xiong
 */
@Configuration
public class EngineJdbcUserConfig extends AbstractUserConfig {
    @Bean
    public JdbcVisitorFactory jdbcVisitorFactory(){
        return imports(JdbcVisitorFactory.class);
    }


    @Bean
    public GenericSampleService jdbcSampleService(){
        return imports(GenericSampleService.class, "jdbc");
    }

}
