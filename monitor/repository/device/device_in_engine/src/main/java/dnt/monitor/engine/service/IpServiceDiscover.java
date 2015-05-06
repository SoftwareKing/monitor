/**
 * Developer: Kadvin Date: 15/3/11 上午9:13
 */
package dnt.monitor.engine.service;

import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.model.Device;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.Service;
import net.happyonroad.model.Credential;
import org.springframework.core.PriorityOrdered;

/**
 * <h1>Discovery IP service against some port</h1>
 */
public interface IpServiceDiscover extends PriorityOrdered {
    /**
     * <h2>该Ip Service Discover所检测的服务(端口和协议)</h2>
     *
     * @return IP服务
     */
    Service service();

    /**
     * <h2>判断node的某个认证方式，是否为该Ip Service Discover所接受</h2>
     *
     * @param credential 认证方式
     * @return 是否接受
     */
    boolean support(Credential credential);

    /**
     * <h2>估计本discover针对特定设备进行发现所需要的最大时间</h2>
     * 这个时间往往用于外部进行超时控制
     *
     * @param device 被发现的设备
     * @return 时间，单位为毫秒，该预估时间应该包括：设备连接尝试，类型识别，内部相信信息发现
     */
    int maxDiscoverTime(Device device);

    /**
     * <h2>判断某个资源节点的特定认证信息是否有效</h2>
     * <p/>
     * 所谓有效，也就是可以登录/执行，获取设备相应的信息；
     *
     * @param node       提供管理信息的节点
     * @param device     设备对象
     * @param credential 认证信息
     * @return 是否可用
     */
    boolean isCredentialAvailable(GroupNode node, Device device, Credential credential);

    /**
     * 采用特定认证信息，对资源执行具体的发现工作
     *
     * @param node       提供管理信息的节点
     * @param device     设备对象
     * @param credential 认证信息
     * @return 发现之后的设备实例
     */
    Device discover(GroupNode node, Device device, Credential credential) throws DiscoveryException;
}
