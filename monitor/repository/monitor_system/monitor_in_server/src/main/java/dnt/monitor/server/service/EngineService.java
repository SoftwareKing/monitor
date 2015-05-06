/**
 * Developer: Kadvin Date: 15/1/6 上午10:19
 */
package dnt.monitor.server.service;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.ApproveStatus;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.RecordNotFoundException;

import java.util.List;

/**
 * <h1>引擎服务</h1>
 */
public interface EngineService extends ResourceService<MonitorEngine> {
    /**
     * <h2>实际监控引擎启动后，向监控服务器注册自身</h2>
     * 有2种情况:
     * <ul>
     * <li>监控引擎是由监控服务器下载下去的，已经被分配了engineId，对于这种情况，需要决定是否批准之
     * <li>用户通过直接安装原始监控引擎包，没有engineId，对于这种情况，需要执行创建动作
     * </ul>
     *
     * @param engine 实际的监控引擎对象
     * @return 注册成功后的监控引擎对象
     */
    MonitorEngine register(MonitorEngine engine) throws ResourceException;

    /**
     * <h2>管理人员手工批准一个自动注册上来的监控引擎</h2>
     *
     * @param engine       监控引擎
     * @param relativePath 设定的监控引擎路径
     * @param engineName   监控引擎的名称
     * @return 批准之后的监控引擎
     * @throws ResourceException
     */
    MonitorEngine approve(MonitorEngine engine, String relativePath, String engineName) throws ResourceException;

    /**
     * <h2>管理人员手工拒绝一个自动注册上来的监控引擎</h2>
     *
     * @param engine 监控引擎
     * @return 拒绝之后的监控引擎
     * @throws ResourceException
     */
    MonitorEngine reject(MonitorEngine engine) throws ResourceException;

    /**
     * <h2>根据引擎的id查找相应的监控引擎</h2>
     *
     * @param engineId 引擎的id
     * @return 查找到的监控引擎
     * @throws RecordNotFoundException
     */
    MonitorEngine findByEngineId(String engineId) throws RecordNotFoundException;

    /**
     * <h2>查找某个状态的监控引擎</h2>
     *
     * @param status 状态
     * @return 监控引擎列表
     */
    List<MonitorEngine> findAllByStatus(ApproveStatus status);
}
