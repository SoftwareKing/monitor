/**
 * Developer: Kadvin Date: 14/12/22 上午10:17
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.NodeService;
import net.happyonroad.platform.web.annotation.BeforeFilter;
import net.happyonroad.platform.web.exception.WebServerSideException;
import net.happyonroad.util.MiscUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>发现控制器</h1>
 * <pre>
 * <b>HTTP    URI                            方法      含义  </b>
 *  POST     /api/discover/{path}/           discover 对特定节点进行发现
 * </pre>
 */
@RestController
@RequestMapping("/api/discover/**")
class DiscoveryController extends GreedyPathController {
    @Autowired
    NodeService  service;

    protected ManagedNode targetNode;

    /**
     * <h2>发现管理节点</h2>
     * <p>
     * POST /api/node/{path}/discover
     * </p>
     */
    @RequestMapping(method = RequestMethod.POST)
    public void discover() {
        logger.warn("Discovering {}", targetNode);
        try {
            service.discover(targetNode);
        } catch (NodeException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                                             "Failed to discover managed node of " + targetPath +
                                             ", because of:" + MiscUtils.describeException(e));
        }
        logger.warn("Discovered   {}", targetNode);
    }

    /**
     * <h2>根据路径初始化管理节点实例</h2>
     */
    @BeforeFilter(order = 60)//after path initialization
    public void initTargetNode() {
        targetNode = service.findByPath(targetPath);
    }

}
