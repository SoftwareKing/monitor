package dnt.monitor.service;

import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaIndicator;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Component;
import dnt.monitor.model.Entry;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.model.Credential;

import java.util.List;

/**
 * <h1>一般采集服务</h1>
 *
 * @author Jay Xiong
 */
public interface SampleService {
    /**
     * <h2>采集特定管理节点对应的资源详情</h2>
     * 采集的时候，需要自动包括关键的指标信息，关键的组件对象
     *
     * @param node       管理节点
     * @param model      设备模型
     * @return 对应的设备实例
     * @throws SampleException 采集时遇到的异常
     */
    Resource sampleResource(ResourceNode node, MetaResource model) throws SampleException;

    /**
     * <h2>采集特定管理节点下的一组组件详情</h2>
     *
     * @param node     管理节点
     * @param relation 对应组件集合字段的关系模型
     * @return 对应的组件集合
     * @throws SampleException 采集时遇到的异常
     */
    List<Component> sampleComponents(ResourceNode node, MetaRelation relation) throws SampleException;

    /**
     * <h2>采集特定管理节点下的某个组件详情</h2>
     *
     * @param node     管理节点
     * @param relation 对应组件字段的关系模型
     * @return 对应的组件实例
     * @throws SampleException 对应的组件实例
     */
    Component sampleComponent(ResourceNode node, MetaRelation relation) throws SampleException;

    /**
     * <h2>采集特定管理节点下某个组件集合里面的组件详情</h2>
     *
     * @param node       管理节点
     * @param relation   对应组件集合字段的关系模型
     * @param identifier 对应组件的标记，具体是哪个标记，由各自规则决定
     * @return 对应的组件实例
     * @throws SampleException 对应的组件实例
     */
    Component sampleComponent(ResourceNode node, MetaRelation relation, Object identifier) throws SampleException;

    /**
     * <h2>采集特定管理节点下的一组结构体详情</h2>
     *
     * @param node      管理节点
     * @param relation 对应结构体集合字段的关系模型
     * @return 对应的结构体集合
     * @throws SampleException 采集时遇到的异常
     */
    List<Entry> sampleEntries(ResourceNode node, MetaRelation relation) throws SampleException;

    /**
     * <h2>采集特定管理节点下的结构体详情</h2>
     *
     * @param node      管理节点
     * @param relation 对应结构体字段的关系模型
     * @return 对应的结构体
     * @throws SampleException 采集时遇到的异常
     */
    Entry sampleEntry(ResourceNode node, MetaRelation relation) throws SampleException;
}
