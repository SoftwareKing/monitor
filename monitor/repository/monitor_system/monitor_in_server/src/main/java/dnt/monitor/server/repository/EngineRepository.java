/**
 * Developer: Kadvin Date: 15/1/6 下午3:18
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.ApproveStatus;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.repository.ResourceRepository;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * The engine repository
 */
public interface EngineRepository extends ResourceRepository<MonitorEngine> {
    /**
     * <h2>查找缺省监控引擎</h2>
     *
     * @return 缺省监控引擎，找不到则返回null
     */
    MonitorEngine findDefaultEngine();

    /**
     * <h2>根据引擎id查找监控引擎</h2>
     *
     * @param engineId 引擎的id
     * @return 监控引擎，找不到则返回null
     */
    MonitorEngine findByEngineId(String engineId);

    /**
     * 统计当前最大的pending数目
     *
     * @return 最大的pending数目
     */
    int countMaxPending();

    /**
     * <h2>查找某个状态的监控引擎</h2>
     *
     * @param status 状态
     * @return 监控引擎列表
     */
    List<MonitorEngine> findAllByApproveStatus(@Param("status") ApproveStatus status);
}
