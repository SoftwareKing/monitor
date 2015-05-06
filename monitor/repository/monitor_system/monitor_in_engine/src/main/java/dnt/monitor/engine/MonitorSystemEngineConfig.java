package dnt.monitor.engine;

import dnt.monitor.DefinitionUserConfig;
import dnt.monitor.engine.service.ResourceDiscover;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

/**
 * <h1>Monitor System Engine Config</h1>
 *
 * @author Jay Xiong
 */
@ComponentScan("dnt.monitor.engine.discover")
@Import(DefinitionUserConfig.class)
public class MonitorSystemEngineConfig extends EngineDefinitionAppConfig{
    @Autowired
    @Qualifier("mySqlDiscover")
    ResourceDiscover mysqlDiscover;
    @Autowired
    @Qualifier("redisDiscover")
    ResourceDiscover redisDiscover;
    @Autowired
    @Qualifier("nginxDiscover")
    ResourceDiscover nginxDiscover;

    @Override
    protected void doExports() {
        super.doExports();
        //临时将 mysql 放在 monitor system里面
        exports(ResourceDiscover.class, mysqlDiscover, "mysql");
        exports(ResourceDiscover.class, redisDiscover, "redis");
        exports(ResourceDiscover.class, nginxDiscover, "nginx");
    }
}
