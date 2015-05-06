package dnt.monitor.engine.discover;

import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.engine.service.ResourceDiscover;
import dnt.monitor.engine.service.SampleHelper;
import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Application;
import dnt.monitor.model.Host;
import dnt.monitor.model.Process;
import dnt.monitor.model.Resource;
import dnt.monitor.service.MetaService;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.MiscUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

/**
 * <h1>Discover Application By Process</h1>
 *
 * @author Jay Xiong
 */
public abstract class DiscoverByProcess<App extends Application> extends ApplicationSupportBean
        implements ResourceDiscover<App> {
    @Autowired
    MetaService metaService;

    @Override
    public boolean support(SampleHelper helper) {
        return helper.getResourceType().startsWith("/device/host")
               && helper.isGenericSampleService()
               && helper.getVisitor() instanceof ShellVisitor;
    }

    /**
     * <h2>根据进程名称进行mysql的发现</h2>
     *
     * @param helper 辅助器
     * @return 发现的mysql实例
     */
    @Override
    public List<App> discover(SampleHelper helper) throws DiscoveryException {
        Host host = (Host) helper.getResource();
        MetaResource metaResource = metaService.getMetaResource(host.getType());
        MetaRelation relation = (MetaRelation) metaResource.getMember("processes");
        List<dnt.monitor.model.Process> processes;
        // 支持参数
        try {
            //TODO 实际上，这里可以绕过对象化机制，直接执行命令
            //  如果这样，就会遇到与下面的配置文件内容读取script一样的问题，需要在这个discover里面做多os适配
            //  还有一种方式，就是为mysql在不同的os上写多个discover，如 MySqlWindowsDiscover, MySqlLinuxDiscover ...
            // 不过，即便是现在这种采用 复用机制，其实传入的 grep 参数仍然支持不了 windows
            //  还是要与 windows 做适配，把 grep 改为 findstr
            // 进而言之，其实是host的 processes 关系，既然支持了参数，那么不应该作为一个透传参数，而是应该为传入的每个参数定义含义
            //  譬如，就认为 第一个参数为进程名称，那么， 在其模型的各种指令中，完成此地进行的os脚本适配
            String arg = filterScript(host);
            //noinspection unchecked
            processes = (List) helper.sampleComponents(relation, arg);
        } catch (SampleException e) {
            return Collections.emptyList();
        }
        if (processes == null || processes.isEmpty()) return Collections.emptyList();
        List<App> container = new ArrayList<App>();
        App app = createResource(processes);
        //不将新发现出来的资源与host直接建立关系，以免向上汇报时，把host又传上去
        //但是，将主机的地址放在其properties里面
        app.setProperty(Resource.PROPERTY_HOST_ADDRESS, host.getAddress());

        ShellVisitor visitor = (ShellVisitor) helper.getVisitor();
        try {
            Properties properties = readAppProperties(visitor, host, app);
            if( properties != null ){
                app.getProperties().putAll(properties);
            }
            String home = judgeAppHome(visitor, host, app);
            app.setHome(home);
            int port = judgeAppPort(visitor, host, app);
            //设置端口
            app.setAddress(host.getAddress() + ":" + port);
            app.setLabel(app.getClass().getSimpleName() + "@" + app.getAddress());
        } catch (SampleException e) {
            logger.warn("Can't discovery {} on {}, because of {}", app, host, MiscUtils.describeException(e));
            return Collections.emptyList();
        }
        container.add(app);
        return container;
    }

    protected abstract String filterScript(Host host);

    protected abstract App createResource(List<Process> processes);

    protected abstract Properties readAppProperties(ShellVisitor visitor, Host host, App app) throws SampleException;

    protected abstract String judgeAppHome(ShellVisitor visitor, Host host, App app)throws SampleException;

    protected abstract int judgeAppPort(ShellVisitor visitor, Host host, App app) throws SampleException;
}
