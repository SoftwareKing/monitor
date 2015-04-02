/**
 * Developer: Kadvin Date: 15/1/6 下午3:18
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.repository.ResourceRepository;

/**
 * The engine repository
 */
public interface EngineRepository extends ResourceRepository<MonitorEngine> {
    MonitorEngine findByEngineId(String engineId);

    /**
     * 统计当前最大的pending数目
     *
     * @return 最大的pending数目
     */
    int countMaxPending();
}
