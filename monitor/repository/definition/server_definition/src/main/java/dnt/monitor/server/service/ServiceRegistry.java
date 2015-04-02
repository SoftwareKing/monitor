/**
 * Developer: Kadvin Date: 14/12/28 下午3:28
 */
package dnt.monitor.server.service;

import dnt.monitor.exception.ResourceException;

/**
 * <h1>资源/Link服务注册表</h1>
 */
public interface ServiceRegistry {
    /**
     * <h2> 为某个type的资源注册相应的服务管理类 </h2>
     * @param type 资源类型
     * @param resourceService  服务管理类实例
     * @param <X> 服务管理类型
     */
    <X extends ResourceService> void register(String type, X resourceService) throws ResourceException;
}
