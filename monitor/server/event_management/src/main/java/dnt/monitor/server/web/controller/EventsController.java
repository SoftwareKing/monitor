package dnt.monitor.server.web.controller;

import dnt.monitor.server.model.Event;
import dnt.monitor.server.service.EventService;
import net.happyonroad.platform.service.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>事件管理的控制器实现</h1>
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  GET      /api/events/{path}                  index     获取特定路径下所有的事件
 * </pre>
 *
 * @author Chris Zhu
 * @email  zhulihongpm@163.com
 */
@RestController
@RequestMapping("/api/events/**")
class EventsController extends GreedyPathController<Event>
{
    @Autowired
    EventService service;

    /**
     * <h2>分页查看特定路径所对应的事件列表</h2>
     * <pre>
     *  GET /api/events/{path}?page={int}&count={int}&order={string}
     * </pre>
     * @return 事件列表
     */
    @RequestMapping(method = RequestMethod.GET)
    public Page<Event> index()
    {
        logger.debug("Paging show events");
        indexPage = service.paginateByPath(targetPath, pageRequest);
        logger.debug("Found   {}", indexPage);
        return indexPage;
    }
}
