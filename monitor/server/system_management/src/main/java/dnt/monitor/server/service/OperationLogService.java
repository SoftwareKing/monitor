package dnt.monitor.server.service;

import dnt.monitor.server.model.OperationLog;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;

/**
 * 操作日志的业务接口定义
 *
 * @author Chris Zhu
 * @email  zhulihongpm@163.com
 */

public interface OperationLogService
{
    /**
     * 查询特定路径下所有的操作日志
     *
     * @param path     管理节点的路径
     * @param pageable 分页请求
     * @return         符合特定路径和分页条件的操作日志
     */
    Page<OperationLog> paginateByPath(String path, Pageable pageable);
}
