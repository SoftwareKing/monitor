package dnt.monitor.server.service;

import dnt.monitor.server.model.Event;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;
import net.happyonroad.type.Severity;
import org.w3c.dom.events.EventException;

import java.util.List;
import java.util.Map;

/**
 * 事件相关的业务方法定义
 *
 * @author Chris Zhu
 * @email  zhulihongpm@163.com
 */

public interface EventService
{
    /**
     * 对特定路径的事件按照级别进行汇总
     * @param path  被汇总的路径
     * @return      汇总结果
     */
    Map<Severity, Integer> summary(String path);

    /**
     * 查询特定路径下所有的事件
     *
     * @param path     管理节点的路径
     * @param pageable 分页请求
     * @return         符合特定路径和分页条件的事件列表
     */
    Page<Event> paginateByPath(String path, Pageable pageable);

    /**
     * 创建事件
     *
     * @param event 事件对象
     * @return      事件对象
     */
    Event create(Event event) throws EventException;

    /**
     *  查找所有事件的path
     * @return path列表
     */
    List<String> findDistinctPath();
}
