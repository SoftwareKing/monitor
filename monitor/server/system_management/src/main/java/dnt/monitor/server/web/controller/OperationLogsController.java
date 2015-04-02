package dnt.monitor.server.web.controller;

import dnt.monitor.server.model.OperationLog;
import dnt.monitor.server.service.OperationLogService;
import net.happyonroad.platform.service.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>操作日志的控制器实现</h1>
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  GET      /api/operation_logs/{path}                    index    获取特定路径下所有的操作日志
 * </pre>
 *
 * @author Chris Zhu
 * @email  zhulihongpm@163.com
 */
@RestController
@RequestMapping("/api/operation_logs/**")
class OperationLogsController extends GreedyPathController<OperationLog>
{
    @Autowired
    OperationLogService service;

    /**
     * <h2>分页查看特定路径所对应的操作日志列表</h2>
     * <pre>
     *  GET /api/operation_logs/{path}?page={int}&count={int}&order={string}
     * </pre>
     * @return 操作日志列表
     */
    @RequestMapping
    public Page<OperationLog> index()
    {
        logger.debug("Paging show operation logs");
        indexPage = service.paginateByPath(targetPath, pageRequest);
        logger.debug("Found   {}", indexPage);
        return indexPage;
    }
}
