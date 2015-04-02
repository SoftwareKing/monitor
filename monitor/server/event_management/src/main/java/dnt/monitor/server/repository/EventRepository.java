package dnt.monitor.server.repository;

import dnt.monitor.server.model.Event;
import net.happyonroad.platform.service.Pageable;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 操作日志的数据访问接口
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

public interface EventRepository
{
    /**
     * 对特定路径下面的事件按照级别进行汇总
     *
     * @param path 路径标识
     * @return     每个级别对应的事件数目
     */
    List<Map<String, Object>> summary(@Param("path") String path);

    /**
     * 查询符合特定路径的事件数
     *
     * @param path 路径标识
     * @return     事件数
     */
    long countByPath(@Param("path") String path);

    /**
     * 分页查询符合某个路径的事件数
     *
     * @param path     路径标识
     * @param pageable 分页条件
     * @return         分页后的事件列表
     */
    List<Event> findPaginationByPath(@Param("path") String path, @Param("pageable") Pageable pageable);

    /**
     * 查询所有的事件
     * @return
     */
    List<String> findDistinctPath();

    /**
     * 创建事件
     */
    void create(Event event);
}
