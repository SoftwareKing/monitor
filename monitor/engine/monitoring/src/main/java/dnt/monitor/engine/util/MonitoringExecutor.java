package dnt.monitor.engine.util;

import dnt.monitor.engine.exception.MonitoringException;
import dnt.monitor.engine.exception.MonitoringTooOftenException;
import dnt.monitor.engine.exception.ResourceUnavailableException;
import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.engine.service.ResourceStore;
import dnt.monitor.engine.service.SampleHelper;
import dnt.monitor.engine.service.SampleHelperFactory;
import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Resource;
import dnt.monitor.service.MetaService;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.MiscUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.jmx.export.naming.SelfNaming;

import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;

/**
 * <h1>执行定期检测的监控任务</h1>
 * 定期检测的逻辑为：
 * <ol>
 * <li>先判断对应的资源是否可用，顺便锁定1个(或多个)底层资源(visitor)
 * <li>在可用的情况下，定期执行批量采集
 * <li>在不可用的情况下，定期执行可用性判断
 * <li>退出时，释放资源
 * </ol>
 * <p/>
 * 当前采用了一个executor，锁定一个连接资源(如果需要)，定期批量检测目标资源所有指标组
 * 未来这种方式可能因为对底层并发效率不足，需要改为多个资源，而后这个执行器线程又要fork/join多个sub任务
 * <p/>
 * <pre>
 * TODO 另外，还有一些资源的监控频度不高，采用当前的锁定模式，反而一直有一个"长连接"， 这种资源可能就需要采用短连接方式监控
 * 对于以上提到的短连接监控情况，可能需要再写一个Executor，与当前类共享基类；而具体采用长连接还是短连接监控，
 * 这由node/资源的特性决定，另外，也可以采用智能模式：根据实际的监控频度和连接建立的时间消耗对比
 *
 * TODO 增加资源监控的其他可管理指标，包括，平均执行时间，最大执行时间，最小执行时间，连接建立时间等等
 * </pre>
 *
 * @author Jay Xiong
 */
@ManagedResource(description = "监控执行器")
public class MonitoringExecutor extends Bean implements Runnable, SelfNaming {
    private final SampleHelperFactory sampleHelperFactory;
    private final MonitoringTask      task;
    private final TimeInterval        interval;
    private final MetaResource        model;
    private final ResourceStore       resourceStore;

    private long startAt, latestExecutedAt, times;
    private SampleHelper sampleHelper;
    private Resource     resource;

    public MonitoringExecutor(ApplicationContext applicationContext, MonitoringTask task) {
        this.sampleHelperFactory = applicationContext.getBean(SampleHelperFactory.class);
        this.task = task;
        this.interval = task.getFrequency();
        MetaService metaService = applicationContext.getBean(MetaService.class);
        this.model = metaService.getMetaResource(task.getResourceType());
        this.resourceStore = applicationContext.getBean(ResourceStore.class);
        this.resource = task.getNode().getResource();
    }

    // 每个任务，每次到点就执行一次
    @Override
    public void run() {
        long cost = 0;
        if (startAt == 0) startAt = System.currentTimeMillis();
        latestExecutedAt = System.currentTimeMillis();
        times++;
        if (sampleHelper == null) {
            cost = initStuffs();
        } else {
            if (!sampleHelper.isAvailable()) {
                long start = System.currentTimeMillis();
                try {
                    logger.warn("The {} is broken, re-new it ", sampleHelper.getVisitor());
                    sampleHelper.renew();
                    cost = (System.currentTimeMillis() - start);
                } catch (EngineException e) {
                    //可能这种监控方式都不行了
                    initStuffs();
                    cost = System.currentTimeMillis() - start;
                }
            }
        }
        try {
            cost += performSynchronize();
        } catch (Exception e) {
            if (e instanceof MonitoringException)
                throw (MonitoringException) e;
            else
                throw new MonitoringException(this, e);
        }
        if (cost > interval.getMilliseconds()) {
            task.overtime();
            //虽然此次采集到了，结果入库了，但此地仍然抛出异常
            // 外部异常处理者应该根据该异常，考虑调整监控频度
            // 外部处理者可能并不会一接收到该异常就调整监控频度，而是发现连续n次，则进行频度调整
            throw new MonitoringTooOftenException(this, cost, interval);
        } else {
            task.intime();
        }
    }

    protected long initStuffs() {
        long start = System.currentTimeMillis();
        try {
            this.sampleHelper = sampleHelperFactory.createHelper(task.getNode());
        } catch (Exception e) {
            if (e instanceof MonitoringException)
                throw (MonitoringException) e;
            else
                throw new MonitoringException(this, e);
        }
        long cost = System.currentTimeMillis() - start;
        if (sampleHelper != null) {
            logger.info("Init sample helper for {} result in {}", resource, sampleHelper);
        } else {
            //抛出监控异常，外部异常处理者应该将资源的可用性状态改为 Unavailable
            throw new ResourceUnavailableException(this, cost);
        }
        return cost;
    }

    long performSynchronize() throws MonitoringException {
        logger.info("Monitoring {} by {}", resource, sampleHelper);
        long start = System.currentTimeMillis();
        Resource resource;
        //TODO 暂时仅同步资源本身，策略中说明需要同步的组件尚未实现；
        // 等到需要实现该特性时，也需要注意，高频对象每次都要采集，低频对象间隔n次进行采集
        try {
            //此次使用完毕之后，不需要归还
            resource = sampleHelper.sampleResource(model);
        } catch (SampleException e) {
            String message = "Can't sample " + task.getNode() + ", because of " + MiscUtils.describeException(e);
            throw new MonitoringException(this, message);
        }
        //注意：资源的更新的消息处理者，应该在异步线程中工作，不得影响监控线程的效率
        resourceStore.update(this.resource, resource);
        this.resource = resource;
        return System.currentTimeMillis() - start;
    }

    @Override
    protected void performStop() {
        super.performStop();
        if (this.sampleHelper != null) {
            try {
                this.sampleHelper.returnBack();
            } finally {
                this.sampleHelper = null;
            }
        }
    }

    @Override
    public String toString() {
        return "MonitoringExecutor(" +
               task.getNode().getResource().getAddress() +
               ":" + task.getResourceType() + "@" + task.getPath() +
               ')';
    }

    public Resource getResource() {
        return resource;
    }

    public ResourceStore getResourceStore() {
        return resourceStore;
    }

    public MonitoringTask getTask() {
        return task;
    }

    ////////////////////////////////////////
    // JMX 可管理接口
    ////////////////////////////////////////

    @Override
    public ObjectName getObjectName() {
        String safeLabel = Resource.convertAsPath(resource.getLabel());
        String objName = "dnt.monitor.engine:type=monitoring,label=" + safeLabel + "@" + task.getPath();
        try {
            return new ObjectName(objName);
        } catch (MalformedObjectNameException e) {
            throw new IllegalStateException("Bad object name:" + objName, e);
        }
    }

    @ManagedAttribute(description = "被监控对象的管理路径")
    public String getPath() {
        return task.getPath();
    }

    @ManagedAttribute(description = "被监控对象的显示名称")
    public String getLabel() {
        return task.getNode().getLabel();
    }

    @ManagedAttribute(description = "被监控对象的类型")
    public String getResourceType() {
        return model.getType();
    }

    @ManagedAttribute(description = "实际使用的访问对象")
    public String getResourceAddress() {
        return resource.getAddress();
    }

    @ManagedAttribute(description = "实际监控频度，由于存在动态调整特性，该值与节点规划的监控频度可能并不一致")
    public String getFrequency() {
        return interval.getInterval();
    }

    @ManagedAttribute(description = "应用的监控策略名称")
    public String getPolicyName() {
        return task.getPolicy().getLabel();
    }

    @ManagedAttribute(description = "发生的超时次数")
    public int getOvertimes() {
        return task.getOvertimes();
    }

    @ManagedAttribute(description = "发生的错误次数")
    public int getFails() {
        return task.getFails();
    }

    @ManagedAttribute(description = "实际使用的访问对象")
    public String getVisitorName() {
        if (sampleHelper == null) return null;
        return sampleHelper.getVisitor().toString();
    }

    @ManagedAttribute(description = "实际使用的采集服务")
    public String getSampleServiceName() {
        if (sampleHelper == null) return null;
        return sampleHelper.toString();
    }

    @ManagedAttribute(description = "第一次运行的开始时间")
    public long getStartAt() {
        return startAt;
    }

    @ManagedAttribute(description = "最近一次运行的开始时间")
    public long getLatestExecutedAt() {
        return latestExecutedAt;

    }

    @ManagedAttribute(description = "运行次数")
    public long getTimes() {
        return times;
    }
}
