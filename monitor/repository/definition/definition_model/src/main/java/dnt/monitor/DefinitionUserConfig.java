/**
 * Developer: Kadvin Date: 15/1/6 下午10:47
 */
package dnt.monitor;

import dnt.monitor.service.CategoryService;
import dnt.monitor.service.MetaService;
import dnt.monitor.service.TypeConverterService;
import net.happyonroad.spring.config.AbstractUserConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>使用/依赖 Service Definition模块的 应用配置 </h1>
 */
@Configuration
public class DefinitionUserConfig extends AbstractUserConfig{

    @Bean
    public CategoryService categoryService() {
        return imports(CategoryService.class);
    }

    @Bean
    public MetaService metaService() {
        return imports(MetaService.class);
    }

    @Bean
    TypeConverterService typeConverterService(){
        return imports(TypeConverterService.class);
    }
}
