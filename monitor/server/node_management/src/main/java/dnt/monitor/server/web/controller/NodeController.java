/**
 * Developer: Kadvin Date: 14/12/22 上午10:17
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.EventService;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.platform.web.annotation.BeforeFilter;
import net.happyonroad.platform.web.exception.WebServerSideException;
import net.happyonroad.type.Severity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

/**
 * <h1>管理节点控制器</h1>
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  GET      /api/node/{path}                    show     获取特定节点的信息
 *                           ?summary={bool}             summary = true，汇总告警信息
 *                           &merge={bool}               merge = true，合并父节点属性
 *  PUT      /api/node/{path}                    update   修改特定节点的管理属性
 *  DELETE   /api/node/{path}?force={true|false} delete   删除特定节点
 *  POST     /api/node/{path}/discover           discover 对特定节点进行发现
 * </pre>
 */
@RestController
@RequestMapping("/api/node/**")
class NodeController extends GreedyPathController {
    @Autowired
    NodeService  service;
    @Autowired
    EventService eventService;

    protected ManagedNode targetNode;

    /**
     * <h2>显示管理节点</h2>
     * <p>
     * GET /api/node/{path}?summary={bool}&merge={bool}
     * </p>
     *
     * @return 需要显示的管理节点
     */
    @RequestMapping
    public ManagedNode show(@RequestParam(value = "summary", defaultValue = "true") boolean summary,
                            @RequestParam(value = "merge", defaultValue = "true") boolean merge) {
        logger.debug("Inspecting {}", targetNode);
        if (!targetNode.getPath().equals("/") && merge) {
            //为当前节点合并上级属性，parent = null意味着要自行获取
            service.merge(targetNode, null);
        }
        if (summary) {
            Map<Severity, Integer> eventSummary = eventService.summary(targetPath);
            targetNode.setSummary(eventSummary);
        }
        return targetNode;
    }

    /**
     * <h2>修改管理节点</h2>
     * 在修改管理节点时，可能会修改资源节点的信息，具体修改哪些信息，由资源节点的视图决定
     * <p>
     * PUT /api/node/{path}
     * </p>
     *
     * @return 修改后的管理节点信息
     */
    @RequestMapping(method = RequestMethod.PUT)
    public ManagedNode update(@RequestBody @Valid ManagedNode inputNode) {
        logger.info("Updating {}", targetNode);
        try {
            targetNode = service.update(targetNode, inputNode);
        } catch (NodeException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                                             "Failed to update managed node under " + targetPath);
        }
        logger.info("Updated  {}", targetNode);
        return targetNode;
    }

    /**
     * <h2>删除管理节点</h2>
     * <p>
     * DELETE /api/node/{path}?force={true|false}
     * </p>
     * TODO 支持 force 参数，自动删除其周边的link
     */
    @RequestMapping(method = RequestMethod.DELETE)
    public void delete(@RequestParam(value = "force", defaultValue = "false") boolean force) {
        logger.warn("Deleting {}", targetNode);
        try {
            service.delete(targetNode, force);
        } catch (NodeException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                                             "Failed to delete managed node of " + targetPath);
        }
        logger.warn("Deleted  {}", targetNode);
    }

    /**
     * <h2>根据路径初始化管理节点实例</h2>
     */
    @BeforeFilter(order = 60)//after path initialization
    public void initTargetNode() {
        targetNode = service.findByPath(targetPath);
    }

}
