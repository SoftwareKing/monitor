package dnt.monitor.server.repository;


import dnt.monitor.server.model.OperationLog;
import net.happyonroad.platform.service.Pageable;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 操作日志的数据访问接口
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

public interface OperationLogRepository
{
    /**
     * 查询符合特定路径的操作日志数
     *
     * @param path 路径标识
     * @return     操作日志数
     */
    long countByPath(@Param("path") String path);

    /**
     * 分页查询符合某个路径的日志数
     *
     * @param path     路径标识
     * @param pageable 分页条件
     * @return         分页后的操作日志列表
     */
    List<OperationLog> findPaginationByPath(@Param("path") String path, @Param("pageable") Pageable pageable);
}
