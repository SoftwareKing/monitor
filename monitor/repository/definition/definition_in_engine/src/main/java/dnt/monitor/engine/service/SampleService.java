package dnt.monitor.engine.service;

import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Resource;
import dnt.monitor.service.Visitor;
import org.springframework.core.PriorityOrdered;

/**
 * <h1>简单采集服务</h1>
 *
 * 还有更高级的通用采集服务(GenericSampleService)
 *
 * @author Jay Xiong
 */
public interface SampleService extends PriorityOrdered{
    /**
     * <h2>判断本采集服务是否支持特定资源类型</h2>
     *
     * @param model 资源实例
     * @return 是否支持
     */
    boolean support(MetaResource model);

    /**
     * <h2>判断本采集服务是否支持特定访问对象</h2>
     *
     * @param visitor 访问对象
     * @return 是否支持
     */
    boolean support(Visitor visitor);


    /**
     * <h2>采集特定管理节点对应的资源详情</h2>
     * 采集的时候，需要自动包括关键的指标信息，关键的组件对象
     *
     * @param visitor 其所接受的访问器
     * @param model   设备模型，这个设备模型与visitor当前绑定的资源对象的类型可能并不一样
     * @return 对应的设备实例
     * @throws dnt.monitor.exception.SampleException 采集时遇到的异常
     */
    Resource sampleResource(Visitor visitor, MetaResource model) throws SampleException;
}
