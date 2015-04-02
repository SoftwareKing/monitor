/**
 * Developer: Kadvin Date: 15/1/23 上午10:09
 */
package dnt.monitor.server.service;

import dnt.monitor.model.MonitorServer;

/**
 * <h1>关于监控服务器的服务</h1>
 */
public interface MonitorServerService {
    MonitorServer getServer();

    void updateServer(MonitorServer server);
}
