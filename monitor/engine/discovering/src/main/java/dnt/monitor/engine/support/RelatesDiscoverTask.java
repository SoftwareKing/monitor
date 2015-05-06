package dnt.monitor.engine.support;

import dnt.monitor.engine.service.ResourceDiscover;
import dnt.monitor.engine.service.SampleHelper;
import dnt.monitor.model.Host;
import dnt.monitor.model.Resource;
import net.happyonroad.spring.Bean;

import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * <h1>Relates Discover Task</h1>
 * 主机关联资源发现任务，关联资源发现的逻辑是：
 * <ol>
 * <li>找到所有资源包，询问其在特定主机上是否有对应实例
 * <li>相应的资源包，采用其自身判断逻辑进行判断，判断的主要方法是，端口判断, 进程判断, 目录判断
 * </ol>
 * 在这个过程中，资源包里面的发现代码可能会要求采集相应主机的特定信息，如进程列表，TCP/UDP端口列表
 *
 * @author Jay Xiong
 */
public class RelatesDiscoverTask extends Bean implements Callable<Resource[]> {

    private final SampleHelper           helper;
    private final List<ResourceDiscover> discovers;

    public RelatesDiscoverTask(SampleHelper helper, List<ResourceDiscover> discovers) {
        this.helper = helper;
        this.discovers = discovers;
    }

    @Override
    public Resource[] call() throws Exception {
        List<Resource> resources = new LinkedList<Resource>();
        for (ResourceDiscover discover : discovers) {
            if (!discover.support(helper)) continue;
            List<Resource> discovered = discover.discover(helper);
            if (discovered != null && !discovered.isEmpty())
                resources.addAll(discovered);
        }
        return resources.toArray(new Resource[resources.size()]);
    }
}
