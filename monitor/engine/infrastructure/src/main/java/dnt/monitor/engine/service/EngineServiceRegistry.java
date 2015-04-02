/**
 * Developer: Kadvin Date: 15/2/16 下午3:38
 */
package dnt.monitor.engine.service;

/**
 * <h1>引擎面向监控服务器的服务注册表</h1>
 */
public interface EngineServiceRegistry {
    <T> void register(Class<T> serviceClass, T service);
}
