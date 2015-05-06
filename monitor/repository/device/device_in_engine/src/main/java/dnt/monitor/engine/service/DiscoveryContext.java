package dnt.monitor.engine.service;

import dnt.monitor.exception.EngineException;

import java.util.Set;

/**
 * <h1>发现的上下文</h1>
 *
 * @author Jay Xiong
 */
public interface DiscoveryContext {
    /**
     * <h2>申请对某个设备的发现锁</h2>
     *
     * @param name  设备名称
     * @param ips 设备拥有的地址
     */
    void acquire(String name, Set<String> ips) throws EngineException;
}
