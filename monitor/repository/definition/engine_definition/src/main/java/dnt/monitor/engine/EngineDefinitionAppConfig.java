package dnt.monitor.engine;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * <h1>各个扩展组件缺省的Engine部分配置</h1>
 *
 * @author Jay Xiong
 */
@Configuration
@ComponentScan({"dnt.monitor.engine.support","dnt.monitor.engine.handler"})
public class EngineDefinitionAppConfig {
}
