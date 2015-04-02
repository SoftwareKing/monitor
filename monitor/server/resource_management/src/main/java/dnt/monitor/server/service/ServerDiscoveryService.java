/**
 * Developer: Kadvin Date: 15/3/12 下午2:41
 */
package dnt.monitor.server.service;

import dnt.monitor.model.Device;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.exception.DiscoveryException;
import net.happyonroad.model.IpRange;
import net.happyonroad.model.SubnetRange;
import org.springframework.scheduling.concurrent.ScheduledExecutorTask;

import java.util.List;
import java.util.Set;

/**
 * <h1>监控服务器提供的发现服务的接口</h1>
 */
public interface ServerDiscoveryService {
    /**
     * <h2>由Server发起，让引擎执行从本节点开始的自动发现任务</h2>
     *
     * @param engine 需要执行自动发现的引擎
     */
    void startFirstDiscovery(MonitorEngine engine) throws DiscoveryException;

    /**
     * <h2>对某个ip范围进行发现</h2>
     * 本发现包括一个向上递归动作，在找到某个交换机设备后，
     * 如果深度没有超过限制，会根据其缺省路继续向上发现；
     * 暂时还不会对交换机设备内的子网进行向下递归发现
     *
     * @param engine  需要执行自动发现的引擎
     * @param range   当前需要被发现的IP范围
     * @param depth   发现的最大深度,如果深度小于0，则不会进行发现
     * @throws dnt.monitor.server.exception.DiscoveryException 发现过程中的异常
     */
    void discoveryRange(MonitorEngine engine,
                        SubnetRange range,
                        int depth) throws DiscoveryException;
}
