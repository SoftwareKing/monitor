/**
 * Developer: Kadvin Date: 14/12/24 下午2:49
 */
package dnt.monitor.server.repository;


import dnt.monitor.server.model.MonitorLog;
import net.happyonroad.platform.service.Pageable;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 监控日志访问接口
 */
public interface MonitorLogRepository {
    long countByPath(@Param("path") String path);

    List<MonitorLog> findAllByPath(@Param("path") String path,
                                   @Param("pageable") Pageable pageable);
}
