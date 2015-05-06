package dnt.monitor.engine;

import net.happyonroad.spring.config.AbstractAppConfig;
import dnt.monitor.DefinitionUserConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>各个扩展组件缺省的Engine部分配置</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.engine.support","dnt.monitor.engine.handler"})
@Import(DefinitionUserConfig.class)
public class EngineDefinitionAppConfig extends AbstractAppConfig{

}
