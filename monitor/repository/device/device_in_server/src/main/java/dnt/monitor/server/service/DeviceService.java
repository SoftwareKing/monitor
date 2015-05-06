/**
 * Developer: Kadvin Date: 15/3/5 上午9:11
 */
package dnt.monitor.server.service;

import dnt.monitor.model.Device;
import dnt.monitor.server.service.ResourceService;

import java.util.List;

/**
 * <h1>Device Service</h1>
 */
public interface DeviceService<D extends Device> extends ResourceService<D> {
    /**
     * <h2>寻找某个Device，其address或者addressEntries里面包括相应的地址</h2>
     *
     * @param address 地址
     * @return 找到的地址
     */
    D findWithAddress(String address);

    /**
     * <h2>找到所有Device，其address或者addressEntries里面包括相应的地址</h2>
     *
     * @param addresses 地址列表
     * @param except 被排除的设备
     * @return 找到的设备集合
     */
    List<D> findAllInAddresses(List<String> addresses, Device except);
}
