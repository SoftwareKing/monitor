/**
 * Developer: Kadvin Date: 14/12/26 上午10:33
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.model.Resource;
import dnt.monitor.server.service.ResourceService;
import net.happyonroad.platform.service.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>一般资源管理控制器接口</h1>
 * 当使用者通过这个API入口访问资源信息时，其将看不到任何子类特征
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  GET      /api/resources/**                   index     分页获取某种类型的资源
 *                          &page={int}          第几页
 *                          &count={int}         每页多少条记录
 *                          &order={string}      排序方式
 * </pre>
 * <h2>注意：不应该设计</h2>
 * <ul>
 *     <li>POST /api/resources
 *     <li>PUT /api/resources/:id
 *     <li>DELETE /api/resources/:id
 * </ul>
 * <strong>
 *   因为所有的资源都是通过 节点管理模块进行管理
 *   <pre>
 *   POST /api/nodes/ -> Node(s)Controller -> NodeManager -> XxxManager
 *     ResourceServiceLocator help it
 *   </pre>
 */
@RestController
@RequestMapping("/api/resources/**")
class ResourcesController extends GreedyPathController<Resource> {

    @Autowired
    ResourceService<Resource> service;

    /**
     * <h2>按照类型分页查询资源信息</h2>
     * <p/>
     * GET /api/resources?type={string}&page={int}&count={int}&order={string}
     *
     * @return 资源列表，这些资源对象并未被实例化为其自身类型
     */
    @RequestMapping
    public Page<Resource> index() {
        logger.debug("Listing resources {}", targetPath);
        indexPage = service.paginateByType(targetPath, pageRequest);
        logger.debug("Found   {}", indexPage);
        return indexPage;
    }
}
