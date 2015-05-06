/**
 * Developer: Kadvin Date: 14/12/26 上午11:13
 */
package dnt.monitor.server.service;

import dnt.monitor.model.Host;
import dnt.monitor.server.service.DeviceService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;

/**
 * <h1>主机服务</h1>
 */
public interface HostService<H extends Host> extends DeviceService<H> {
    Page<H> paginateByKeyword(String keyword, Pageable request);
}
