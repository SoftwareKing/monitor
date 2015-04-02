/**
 * Developer: Kadvin Date: 14/12/24 下午3:10
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.server.model.MonitorLog;
import dnt.monitor.server.service.MonitorLogService;
import net.happyonroad.platform.service.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>监控日志控制器</h1>
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  GET      /api/monitor_logs/{path}                    index    获取特定节点路径下所有的监控日志
 * </pre>
 */
@RestController
@RequestMapping("/api/monitor_logs/**")
class MonitorLogsController extends GreedyPathController<MonitorLog> {

    @Autowired
    MonitorLogService monitorLogService;

    /**
     * <h2>查看某个路径所对应的监控日志列表</h2>
     * <p/>
     * GET /api/contracts?page={int}&count={int}&order={string}
     *
     * @return 监控日志列表
     */
    @RequestMapping
    public Page<MonitorLog> index() {
        logger.debug("Listing monitor monitor_logs");
        indexPage = monitorLogService.paginateByPath(targetPath, pageRequest);
        logger.debug("Found   {}", indexPage);
        return indexPage;
    }

}
