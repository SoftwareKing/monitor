package dnt.monitor.engine.support;

import dnt.monitor.engine.exception.MonitoringException;
import dnt.monitor.engine.exception.MonitoringTooOftenException;
import dnt.monitor.engine.exception.ResourceUnavailableException;
import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.engine.service.MonitoringService;
import dnt.monitor.engine.service.MonitoringTaskStore;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.engine.service.TriggerService;
import dnt.monitor.engine.util.MonitoringExecutor;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.type.Availability;
import net.happyonroad.type.Schedule;
import net.happyonroad.type.TimeSpan;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.util.ErrorHandler;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;

/**
 * <h1>缺省的监控执行器</h1>
 *
 * @author Jay Xiong
 */
@Component
@ManagedResource("dnt.monitor.engine:type=service,name=monitoringService")
public class MonitoringManager extends ApplicationSupportBean
        implements MonitoringService, ErrorHandler, ApplicationListener<SystemStartedEvent> {
    @Autowired
    ThreadPoolTaskScheduler scheduler;
    @Autowired
    MonitoringTaskStore     taskStore;
    @Autowired
    NodeStore               nodeStore;
    @Autowired
    TriggerService          triggerService;

    // path -> worker
    Map<String, MonitoringExecutor> executors = new HashMap<String, MonitoringExecutor>();
    Map<String, ScheduledFuture>    futures   = new HashMap<String, ScheduledFuture>();

    public MonitoringManager() {
        setOrder(120);//after DefaultMonitoringTaskStore(110) started
    }

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        scheduler.setErrorHandler(this);
        ScheduledThreadPoolExecutor poolExecutor = scheduler.getScheduledThreadPoolExecutor();
        poolExecutor.setCorePoolSize(100);
        poolExecutor.setMaximumPoolSize(1000);
        poolExecutor.setRemoveOnCancelPolicy(true);
        poolExecutor.setContinueExistingPeriodicTasksAfterShutdownPolicy(false);
        poolExecutor.setExecuteExistingDelayedTasksAfterShutdownPolicy(false);
        Collection<MonitoringTask> tasks = taskStore.getTasks();
        for (MonitoringTask task : tasks) {
            if (task.getNode().isRunning()) {
                ResourceNode merged = nodeStore.merge(task.getNode());
                task.updateNode(merged);
                start(task);
            }
        }
        adjustThreadPool();
    }

    @Override
    protected void performStop() {
        super.performStop();
        scheduler.shutdown();
        for (MonitoringExecutor executor : executors.values()) {
            try {
                executor.stop();
            } catch (Exception e) {
                //ignore any executor's stop error
            }
        }
    }

    @Override
    public void start(MonitoringTask task) {
        String path = task.getPath();
        Schedule schedule = task.getNode().getSchedule();
        TimeSpan window = task.getNode().getMaintainWindow();
        MonitoringExecutor worker = toJob(task);
        Trigger trigger = triggerService.create(task.getFrequency(), schedule, window);
        logger.info("Scheduling {} by {}", worker, trigger);

        ScheduledFuture<?> future = scheduler.schedule(worker, trigger);
        executors.put(path, worker);
        futures.put(path, future);
        registerMbean(worker, worker.getObjectName());
        logger.info("Scheduled  {} by {}", worker, trigger);
        adjustThreadPool();
    }

    @Override
    public void stop(MonitoringTask task) {
        logger.info("UnScheduling {}", task);
        String path = task.getPath();
        ScheduledFuture future = futures.get(path);
        if (future == null) {
            logger.warn("There is no scheduled worker for {}", task);
        } else {
            if (!future.isCancelled() && !future.isDone()) {
                if (future.cancel(true)) {
                    futures.remove(path);
                } else {
                    logger.warn("Can't stop {}", task);
                }
            } else {
                futures.remove(path);
            }
        }
        MonitoringExecutor worker = executors.get(path);
        if (worker != null) {
            worker.stop();
            executors.remove(path);
            unRegisterMbean(worker.getObjectName());
        } else {
            logger.warn("The worker of {} is removed already", task);
        }
        logger.info("UnScheduled  {}", task);
        adjustThreadPool();
    }

    /**
     * <h2>处理各个Worker执行过程中抛出的异常</h2>
     *
     * @param t 错误异常
     */
    @Override
    public void handleError(Throwable t) {
        //每个executor，每个执行周期执行之后，都可能抛出各种异常
        Throwable cause;
        if (t instanceof MonitoringException) {
            cause = t;
        } else {
            // 这些异常可能以某种 其他Execution Exception的封装形式出现
            //noinspection ThrowableResultOfMethodCallIgnored
            cause = ExceptionUtils.getRootCause(t);
            if (cause == null) cause = t;
        }
        if (cause instanceof MonitoringException) {
            MonitoringExecutor executor = ((MonitoringException) cause).getExecutor();
            executor.getTask().fail();
            Resource resource = executor.getResource();
            if (cause instanceof ResourceUnavailableException) {
                if (resource.getAvailability() != Availability.Unavailable) {
                    Resource unavailableResource;
                    try {
                        unavailableResource = (Resource) resource.clone();
                        unavailableResource.setAvailability(Availability.Unavailable);
                        executor.getResourceStore().update(resource, unavailableResource);
                    } catch (CloneNotSupportedException e) {
                        logger.warn("Can't clone " + resource);
                    }
                }
            }
            if (cause instanceof MonitoringTooOftenException) {
                //TODO 当前采用比较简单的策略，连续发现n次，立刻double
                // n由node属性配置
                MonitoringTask task = executor.getTask();
                if (task.isOvertime()) {
                    task.doubleFrequency();
                    update(task);
                }
            } else {
                //TODO 监控异常，记录监控日志
                logger.error("Monitoring Exception: {}", MiscUtils.describeException(cause));

            }
        } else {
            logger.warn("Catch unrecognized execution exception {}", MiscUtils.describeException(cause));
        }

    }

    @Override
    public void update(MonitoringTask newTask) {
        stop(newTask);
        start(newTask);
    }

    void adjustThreadPool() {
        // TODO 根据需要监控的对象数量，动态调整 scheduler 的线程池

    }

    MonitoringExecutor toJob(MonitoringTask task) {
        return new MonitoringExecutor(applicationContext, task);
    }

    ////////////////////////////////////////
    // JMX 可管理接口
    ////////////////////////////////////////

    @ManagedAttribute
    public long getPoolSize(){
        return scheduler.getPoolSize();
    }

    @ManagedAttribute
    public long getCorePoolSize(){
        return scheduler.getScheduledThreadPoolExecutor().getCorePoolSize();
    }

    @ManagedAttribute
    public long getMaxPoolSize(){
        return scheduler.getScheduledThreadPoolExecutor().getMaximumPoolSize();
    }

    @ManagedAttribute
    public long getLargestPoolSize(){
        return scheduler.getScheduledThreadPoolExecutor().getLargestPoolSize();
    }

    @ManagedAttribute
    public long getActiveThreadCount(){
        return scheduler.getActiveCount();
    }

    @ManagedAttribute
    public long getCompletedTaskCount(){
        return scheduler.getScheduledThreadPoolExecutor().getCompletedTaskCount();
    }



}
