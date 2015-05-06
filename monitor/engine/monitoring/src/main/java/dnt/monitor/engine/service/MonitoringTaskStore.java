package dnt.monitor.engine.service;

import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;

import java.util.Collection;
import java.util.List;

/**
 * <h1>监控任务管理器内部接口</h1>
 * <p/>
 * 本接口主要是面向任务控制逻辑，用于调整监控系统内部各个监控任务
 *
 * @author Jay Xiong
 */
public interface MonitoringTaskStore {

    /**
     * <h2>获取已经加载的所有任务</h2>
     */
    Collection<MonitoringTask> getTasks();

    /**
     * <h2>寻找某个节点路径对应的任务</h2>
     *
     * @param nodePath 节点路径
     * @return 监控任务
     */
    MonitoringTask findTask(String nodePath);

    /**
     * <h2>寻找某个群组节点下所有的监控任务</h2>
     *
     * @param path 群组路径
     * @return 监控任务集合
     */
    List<MonitoringTask> findTasks(String path);

    /**
     * <h2>寻找某个资源类型下所有的监控任务</h2>
     *
     * @param resourceType 资源类型
     * @return 监控任务集合
     */
    List<MonitoringTask> findTasksByResourceType(String resourceType);

    /**
     * <h2>创建一个监控任务</h2>
     *  @param node     资源节点
     * @param policy   监控策略
     */
    void createTask(ResourceNode node, ResourcePolicy policy);

    /**
     * <h2>停止并删除一个监控任务</h2>
     *
     * @param nodePath 任务对应的节点路径
     */
    void removeTask(String nodePath);

    /**
     * <h2>当资源节点更新时，更新/调整相应的监控任务</h2>
     *
     * @param nodePath 任务对应的节点路径
     * @param node     资源节点
     */
    void updateTask(String nodePath, ResourceNode node);

    /**
     * <h2>当某个策略更新后，更新相应的监控任务</h2>
     *
     * @param nodePath 任务对应的节点路径
     * @param policy   被更新的策略
     */
    void updateTask(String nodePath, ResourcePolicy policy);
}
