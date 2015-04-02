/**
 * Developer: Kadvin Date: 15/1/6 上午10:19
 */
package dnt.monitor.server.service;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.server.exception.ResourceNotFoundException;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.service.ResourceService;

/**
 * <h1>引擎服务</h1>
 */
public interface EngineService extends ResourceService<MonitorEngine> {
    MonitorEngine findByEngineId(String engineId) throws ResourceNotFoundException;

    MonitorEngine approve(MonitorEngine engine, String relativePath, String engineName) throws ResourceException;

    MonitorEngine reject(MonitorEngine engine) throws ResourceException;
}
