package dnt.monitor.engine.service;

import dnt.monitor.engine.model.MonitoringTask;

/**
 * <h1>监控任务执行器</h1>
 *
 * @author Jay Xiong
 */
public interface MonitoringService {
    /**
     * <h2>启动监控任务</h2>
     *
     * @param task 监控任务
     */
    void start(MonitoringTask task);

    /**
     * <h2>停止监控任务</h2>
     *
     * @param task 监控任务
     */
    void stop(MonitoringTask task);

    /**
     * <h2>更新监控任务</h2>
     *
     * @param newTask 被更新的监控任务
     */
    void update(MonitoringTask newTask);
}
