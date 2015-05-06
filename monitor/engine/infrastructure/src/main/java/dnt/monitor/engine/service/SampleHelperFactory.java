package dnt.monitor.engine.service;

import dnt.monitor.model.ResourceNode;

/**
 * <h1>对特定资源/节点进行采集的工厂</h1>
 * <p/>
 * 能够返回合适的 Visitor/SampleService
 * <p/>
 * 可以被DiscoveryManager/MonitoringExecutor所使用
 *
 * @author Jay Xiong
 */
public interface SampleHelperFactory {
    /**
     * <h2>获取针对特定资源节点的访问器、采集服务</h2>
     *
     * @param node 资源节点
     * @return 采集辅助对象，如果资源节点不可访问，则返回null
     */
    SampleHelper createHelper(ResourceNode node);
}
