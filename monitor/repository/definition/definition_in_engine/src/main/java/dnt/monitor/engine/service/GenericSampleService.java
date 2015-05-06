package dnt.monitor.engine.service;

import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.model.Component;
import dnt.monitor.model.Entry;
import dnt.monitor.service.Visitor;

import java.util.List;

/**
 * <h1>通用采集服务</h1>
 * <p/>
 * 该接口支持对资源整体，资源下的特定组件类型，特定组件实例，特定结构体进行采集
 * <p/>
 * 这种采集服务，往往面向一定的采集规则，而具体的规则内容，由开发者在资源模型上(或者与资源模型配套)
 *
 * @author Jay Xiong
 */
public interface GenericSampleService<V extends Visitor> extends SampleService {

    /**
     * <h2>采集特定管理节点下的一组组件详情</h2>
     *
     * @param visitor  其所接受的访问器
     * @param relation 对应组件集合字段的关系模型
     * @param args
     * @return 对应的组件集合
     * @throws SampleException 采集时遇到的异常
     */
    List<Component> sampleComponents(V visitor, MetaRelation relation, Object... args) throws SampleException;    

    /**
     * <h2>采集特定管理节点下的某个组件详情</h2>
     *
     * @param visitor  其所接受的访问器
     * @param relation 对应组件字段的关系模型
     * @return 对应的组件实例
     * @throws SampleException 对应的组件实例
     */
    Component sampleComponent(V visitor, MetaRelation relation) throws SampleException;

    /**
     * <h2>采集特定管理节点下某个组件集合里面的组件详情</h2>
     *
     * @param visitor    其所接受的访问器
     * @param relation   对应组件集合字段的关系模型
     * @param identifier 对应组件的标记，具体是哪个标记，由各自规则决定
     * @return 对应的组件实例
     * @throws SampleException 对应的组件实例
     */
    Component sampleComponent(V visitor, MetaRelation relation, Object identifier) throws SampleException;

    /**
     * <h2>采集特定管理节点下的一组结构体详情</h2>
     *
     * @param visitor  其所接受的访问器
     * @param relation 对应结构体集合字段的关系模型
     * @return 对应的结构体集合
     * @throws SampleException 采集时遇到的异常
     */
    List<Entry> sampleEntries(V visitor, MetaRelation relation) throws SampleException;

    /**
     * <h2>采集特定管理节点下的结构体详情</h2>
     *
     * @param visitor  其所接受的访问器
     * @param relation 对应结构体字段的关系模型
     * @return 对应的结构体
     * @throws SampleException 采集时遇到的异常
     */
    Entry sampleEntry(V visitor, MetaRelation relation) throws SampleException;

}
