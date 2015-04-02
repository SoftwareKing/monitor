/**
 * Developer: Kadvin Date: 14/12/23 下午1:07
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.platform.web.exception.WebServerSideException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * <h1>Topo控制器</h1>
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  GET      /api/map/{path}                     map        获取特定Topo Map信息
 *  PUT      /api/map/{path}                     updateMap  更新特定Topo Map信息
 *  PUT      /api/topo_nodes/:id                 updateNode 更新特定Topo Node的信息
 *  PUT      /api/topo_links/:id                 updateLink 更新特定Topo Link的信息
 * </pre>
 */
@RestController
class TopoController extends GreedyPathController {
    @Autowired
    TopoService topoService;

    /**
     * <h2>获取特定Topo Map信息</h2>
     * <p>
     * GET /api/map/{path}
     * </p>
     * @return 需要显示的Topo节点对应的map信息
     */
    @RequestMapping("/api/map/**")
    public TopoMap map() {
        logger.debug("Showing map: {}", targetPath);
        TopoMap map = topoService.findMapByPath(targetPath);
        logger.debug("Shown   map: {}", map);
        return map;
    }

    /**
     * <h2>更新特定Topo Map信息</h2>
     * <p>
     * GET /api/map/{path}
     * </p>
     * @return 需要显示的Topo Map信息
     */
    @RequestMapping(value = "/api/map/**", method = RequestMethod.PUT)
    public TopoMap updateMap(@RequestBody @Valid TopoMap map){
        TopoMap exist = topoService.findMapByPath(targetPath);
        logger.info("Updating : {}", map);
        TopoMap updated;
        try {
            updated = topoService.updateMap(exist, map);
            logger.info("Updated  : {}", updated);
        } catch (TopoException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Can' update topo map " + e.getMessage());
        }
        return updated;
    }

    /**
     * <h2>更新特定Topo Node信息</h2>
     * <p>
     * GET /api/topo_nodes/:id
     * </p>
     * @return 需要显示的Topo节点对应的信息
     */
    @RequestMapping("/api/topo_nodes/{id}")
    public TopoNode updateNode(@PathVariable("id") Long id, @RequestBody @Valid TopoNode node){
        TopoNode exist = topoService.findNodeById(id);
        logger.info("Updating : {}", exist, node);
        TopoNode updated;
        try {
            updated = topoService.updateNode(exist, node);
            logger.info("Updated  : {}", updated);
        } catch (TopoException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Can' update topo node "+ e.getMessage());
        }
        return updated;
    }

    /**
     * <h2>更新特定Topo Node信息</h2>
     * <p>
     * GET /api/topo_nodes/:id
     * </p>
     * @return 需要显示的Topo节点对应的信息
     */
    @RequestMapping("/api/topo_links/{id}")
    public TopoLink updateLink(@PathVariable("id") Long id, @RequestBody @Valid TopoLink link){
        TopoLink exist = topoService.findLinkById(id);
        logger.info("Updating : {}", exist);
        TopoLink updated;
        try {
            updated = topoService.updateLink(exist, link);
            logger.info("Updated  : {}", updated);
        } catch (TopoException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Can' update topo link "+ e.getMessage());
        }
        return updated;
    }
}
