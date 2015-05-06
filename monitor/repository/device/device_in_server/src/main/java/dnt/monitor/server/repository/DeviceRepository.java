/**
 * Developer: Kadvin Date: 15/3/5 上午9:07
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.Device;
import dnt.monitor.model.NIC;
import dnt.monitor.model.Service;
import net.happyonroad.platform.service.Pageable;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <h1>Device Repository</h1>
 */
public interface DeviceRepository<D extends Device> extends ResourceRepository<D> {
    long countByKeyword(@Param("keyword") String keyword);

    List<D> findAllByKeyword(@Param("keyword") String keyword,
                             @Param("request") Pageable request);

    /**
     * <h2>创建设备的网卡</h2>
     *
     * @param nic 新建的网卡
     */
    void createNIC(NIC nic);

    /**
     * <h2>更新设备的某个网卡</h2>
     * 网卡的id已经设置好
     *
     * @param nic 被更新的网卡
     */
    void updateNIC(NIC nic);

    /**
     * <h2>删除设备的网卡</h2>
     *
     * @param nic 被删除的网卡
     */
    void deleteNIC(NIC nic);

    /**
     * <h2>创建设备的服务</h2>
     *
     * @param service 新建的服务
     */
    void createService(Service service);

    /**
     * <h2>查找含有特定地址的设备</h2>
     *
     * @param address 地址
     * @return 找到的设备
     */
    D findWithAddress(@Param("address") String address);

    /**
     * <h2>查找所有含有特定地址的设备</h2>
     *
     * @param addresses 地址集合
     * @param exceptId  被排除的设备id
     * @return 找到的设备
     */
    List<D> findAllInAddresses(@Param("addresses") List<String> addresses, @Param("exceptId") Long exceptId);

    /**
     * <h2>创建t_devices里面的局部记录</h2>
     * 这个操作主要是当资源类型由Resource -> Device时，在t_devices表里面，补齐原对象类型欠缺的数据
     *
     * @param device 设备对象
     */
    void createPartialDevice(D device);
}
