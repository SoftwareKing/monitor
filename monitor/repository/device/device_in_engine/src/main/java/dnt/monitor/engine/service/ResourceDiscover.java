package dnt.monitor.engine.service;

import dnt.monitor.engine.exception.DiscoveryException;
import dnt.monitor.model.Resource;

import java.util.List;

/**
 * <h1>主机关联的资源发现器</h1>
 *
 * @author Jay Xiong
 */
public interface ResourceDiscover<R extends Resource> {
    /**
     * <h2>判断当前的资源发现器是否支持采用特定的采集helper进行发现</h2>
     * 开发者可以基于helper后面的资源对象类型，采集方式决定是否支持
     *
     * @param helper 采集辅助器
     * @return 是否支持
     */
    boolean support(SampleHelper helper);

    /**
     * <h2>采用特定的采集辅助器进行主机相关资源的发现</h2>
     *
     * @param helper 辅助器
     * @return 发现的资源集合，如果没发现，返回空list
     */
    List<R> discover(SampleHelper helper) throws DiscoveryException;
}
