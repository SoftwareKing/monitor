/**
 * Developer: Kadvin Date: 15/1/11 下午4:26
 */
package dnt.monitor.server.service;

import dnt.monitor.model.MonitorEngine;

/**
 * <h1>引擎服务的定位器</h1>
 */
public interface EngineServiceLocator {
    <T> T locate(MonitorEngine engine, Class<T> serviceKlass);
}
