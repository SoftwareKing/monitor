/**
 * Developer: Kadvin Date: 15/2/15 下午6:31
 */
package dnt.monitor.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.Device;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.annotation.Timeout;
import net.happyonroad.model.IpRange;

import java.util.List;
import java.util.Set;

/**
 * <h1>采集引擎提供的发现功能</h1>
 *
 * Discovery基本都是一些同步接口，需要基于引擎在线会话操作
 *
 * <pre>
 * discover的功能，基本设计思路是:
 *   引擎作为手脚，仅执行特定/固定的发现工作
 *   服务器作为大脑，执行全局的调度和思考
 * </pre>
 */
@Timeout("1m")
public interface DiscoveryService {
    /**
     * <h2>搜索某个网段有哪些可达的ip地址</h2>
     *
     * @param range ip网段
     * @return 可达的ip地址列表
     */
    //List<String> searchRange(IpRange range)throws EngineException;

    /**
     * <h2>检测ip上的端口服务情况</h2>
     *
     * @param addresses ip地址列表
     * @return 主机等资源上的服务列表
     */
    //Map<String, List<Service>> discoverServices(List<String> addresses)throws EngineException;

    /**
     * <h1>一次性发现特定C类网段内的设备，包括其开放的IP服务</h1>
     * 将: searchRange, discoveryServices合并为一步的发现工作
     * @param range IP网段
     * @return 发现的设备列表
     */
    @Timeout("2m")
    // 由于暂时本接口的返回值需要通过json序列号和反序列化，所以不能声明为list泛型
    Device[] searchDevices(IpRange range) throws EngineException;


    /**
     * <h2>检测某个资源节点有哪些组件构成</h2>
     *
     * @param devicePaths 资源节点
     * @return 包含了相应组件信息的资源对象
     */
    @Timeout("3m")
    Device[] discoverComponents(Set<String> devicePaths)throws EngineException;

    /**
     * <h2>检测某个资源节点上还有部署哪些其他资源（类似于主机上部署的数据库，中间件，应用等）</h2>
     *
     * @param resourceNode 资源节点
     * @return 该主机上的其他资源，这些资源与当前主机应该有 RunAt 的关系
     */
    Resource[] discoverRelates(ManagedNode resourceNode)throws EngineException;

}
