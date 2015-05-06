/**
 * Developer: Kadvin Date: 14/12/26 上午10:59
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.model.Host;
import dnt.monitor.server.service.HostService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.web.controller.ApplicationController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>一般资源管理控制器接口</h1>
 *
 * <pre>
 * <b>HTTP    URI                           方法                     含义  </b>
 *  GET      /api/hosts?keyword={string}    index                  分页获取主机资源
 *                     &page={int}          第几页
 *                     &count={int}         每页多少条记录
 *                     &order={string}      排序方式
 *  GET      /api/hosts/:id                         show           根据id查询主机的详情，包括其中各种组件
 *  GET      /api/hosts/by_address?address={string} showByAddress  根据地址查询主机的详情，包括其中各种组件
 * </pre>
 *
 * <h2>注意：不应该设计</h2>
 * <ul>
 *     <li>POST /api/hosts
 *     <li>PUT /api/hosts/:id
 *     <li>DELETE /api/hosts/:id
 * </ul>
 * <strong>
 *   因为所有的资源都是通过 节点管理模块进行管理
 *   <pre>
 *   POST /api/nodes/ -> Node(s)Controller -> NodeManager -> XxxManager
 *   </pre>
 * </strong>
 */
@RestController
@RequestMapping("/api/hosts")
class HostsController extends ApplicationController<Host> {

    @Autowired
    HostService<Host> service;

    /**
     * <h2>分页获取主机资源</h2>
     * <p/>
     * GET /api/hosts?keyword={string}&page={int}&count={int}&order={string}
     *
     * @return 主机列表，这些主机对象并不包括其组件/链路信息
     */
    @RequestMapping
    public Page<Host> index(@RequestParam(value = "keyword", required = false) String keyword) {
        logger.debug("Listing hosts by {}", keyword);
        indexPage = service.paginateByKeyword(keyword, pageRequest);
        logger.debug("Found   {}", indexPage);
        return indexPage;
    }

    /**
     * <h2>获取主机详情</h2>
     * <p/>
     * GET /api/hosts/:id
     *
     * @return 主机对象，这个主机对象包括其组件/链路信息
     */
    @RequestMapping("{id}")
    public Host show(@PathVariable("id") Long id) {
        logger.debug("Showing host id = {}", id);
        Host host = service.findById(id);
        logger.debug("Shown   {}", host);
        return host;
    }

    /**
     * <h2>获取主机详情</h2>
     * <p/>
     * GET /api/hosts/by_address?address={string}
     *
     * @return 主机对象，这个主机对象包括其组件/链路信息
     */
    @RequestMapping("by_address")
    public Host showByAddress(@RequestParam("address") String address) {
        logger.debug("Showing host address = {}", address);
        Host host = service.findByAddress(address);
        logger.debug("Shown   {}", host);
        return host;
    }

}
