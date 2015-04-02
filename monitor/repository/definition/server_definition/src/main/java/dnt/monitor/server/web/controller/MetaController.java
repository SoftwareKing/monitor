/**
 * Developer: Kadvin Date: 14/12/29 上午11:07
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.meta.MetaResource;
import dnt.monitor.service.MetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>系统类型控制器</h1>
 * <pre>
 * <b>HTTP    URI                                方法         含义  </b>
 *  GET      /api/meta/**                  show        查询系统资源元信息
 * </pre>
 */
@RestController
@RequestMapping("/api/meta")
class MetaController extends GreedyPathController {
    @Autowired
    MetaService metaService;

    @RequestMapping("**")
    public MetaResource show() {
        logger.trace("Showing {}", targetPath);
        MetaResource metaResource = metaService.getMetaResource(targetPath);
        logger.debug("Found   {}", metaResource);
        return metaResource;
    }

}
