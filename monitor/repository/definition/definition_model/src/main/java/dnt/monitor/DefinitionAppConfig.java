/**
 * Developer: Kadvin Date: 15/2/2 下午6:47
 */
package dnt.monitor;

import dnt.monitor.service.CategoryService;
import dnt.monitor.service.MetaService;
import dnt.monitor.service.TypeConverterService;
import net.happyonroad.UtilUserConfig;
import net.happyonroad.spring.config.AbstractAppConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>服务定义模块的应用配置</h1>
 */
@Configuration
@Import(UtilUserConfig.class)
@ComponentScan("dnt.monitor.support")
public class DefinitionAppConfig extends AbstractAppConfig{

    @Override
    public void doExports() {
        exports(CategoryService.class);
        exports(MetaService.class);
        exports(TypeConverterService.class);
    }
}
