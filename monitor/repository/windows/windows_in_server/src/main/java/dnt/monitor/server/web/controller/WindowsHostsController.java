/**
 * Developer: Kadvin Date: 14/12/26 下午11:45
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.model.WindowsHost;
import dnt.monitor.server.service.HostService;
import net.happyonroad.platform.web.controller.ApplicationController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <h1>Windows Host Controller</h1>
 * <pre>
 * <b>HTTP    URI                           方法                     含义  </b>
 *  GET      /api/windows/:id                         show           根据id查询Windows主机的详情，包括WinService
 *  GET      /api/windows/by_address?address={string} showByAddress  根据地址查询Windows主机的详情，包括WinService
 * </pre>
 */
@RestController
@RequestMapping("/api/windows")
class WindowsHostsController extends ApplicationController<WindowsHost> {
    @Autowired
    HostService<WindowsHost> service;

    /**
     * <h2>获取主机资源</h2>
     * <p/>
     * GET /api/windows/:id
     *
     * @return 主机对象，这个主机对象包括其组件/链路信息
     */
    @RequestMapping("{id}")
    public WindowsHost show(@PathVariable("id") Long id) {
        logger.debug("Showing host id = {}", id);
        WindowsHost host = service.findById(id);
        logger.debug("Shown   {}", host);
        return host;
    }

    /**
     * <h2>获取主机资源</h2>
     * <p/>
     * GET /api/windows/by_address?address={string}
     *
     * @return 主机对象，这个主机对象包括其组件/链路信息
     */
    @RequestMapping("by_address")
    public WindowsHost showByAddress(@RequestParam("address") String address) {
        logger.debug("Showing host address = {}", address);
        WindowsHost host = service.findByAddress(address);
        logger.debug("Shown   {}", host);
        return host;
    }
}
