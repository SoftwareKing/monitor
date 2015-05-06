/**
 * Developer: Kadvin Date: 15/1/23 上午10:06
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.MonitorServer;

/**
 * <h1>Monitor Server Repository</h1>
 */
public interface MonitorServerRepository {
    /**
     * 查到唯一的监控服务器对象
     *
     * @return 监控服务器
     */
    MonitorServer findServer();

    /**
     * 创建监控服务器
     *
     * @param server 初始化时需要创建的监控服务器
     */
    void createServer(MonitorServer server);

    /**
     * 更新监控服务器信息
     *
     * @param server 监控服务器
     */
    void updateServer(MonitorServer server);
}
