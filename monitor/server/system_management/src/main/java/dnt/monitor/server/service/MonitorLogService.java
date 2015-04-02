/**
 * Developer: Kadvin Date: 14/12/24 下午2:51
 */
package dnt.monitor.server.service;

import dnt.monitor.server.model.MonitorLog;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;

/**
 * 监控日志服务
 */
public interface MonitorLogService {
    /**
     * 查询特定路径下所有的监控日志
     *
     * @param path     管理节点的路径
     * @param pageable 分页请求
     * @return 分页的MonitorLog数据
     */
    Page<MonitorLog> paginateByPath(String path, Pageable pageable);
}
