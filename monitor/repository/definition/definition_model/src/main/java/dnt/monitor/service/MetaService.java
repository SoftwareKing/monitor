/**
 * Developer: Kadvin Date: 14-3-3 下午2:19
 */
package dnt.monitor.service;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.*;
import dnt.monitor.model.*;
import org.springframework.core.type.AnnotationMetadata;

import java.util.Set;

/**
 * 关于模型的服务，面向开发人员，运行期系统扩展
 */
public interface MetaService {
    /**
     * <h2>获取特定特性的元模型</h2>
     *
     * @param klass  对象类型
     * @param <Meta> 元模型类别
     * @return 元模型实例
     * @throws dnt.monitor.exception.MetaException 如果找不到，则抛出
     */
    <Meta extends MetaModel> Meta meta(Class klass) throws MetaException;

    /**
     * <h2>注册一个新的元模型</h2>
     *
     * 解析开始时，预先注册进来
     *
     * @param metaModel 可监控模型
     */
    void register(MetaModel metaModel) throws MetaException;

    /**
     * <h2>注销一个新的元模型</h2>
     *
     * 解析不成功时，通过该接口回退
     *
     * @param metaModel 可监控模型
     */
    void unregister(MetaModel metaModel);
    /**
     * 查询某个资源class对应的资源模型
     *
     * @param type 资源的class，必须为Resource的子类
     * @return 对应的资源模型
     */
    MetaResource getMetaResource(Class<? extends Resource> type);

    /**
     * 查询某个组件class对应的组件模型
     *
     * @param type 组件的class，必须为Component的子类
     * @return 对应的组件模型
     */
    MetaComponent getMetaComponent(Class<? extends Component> type);

    /**
     * 查询某个结构体class对应的组件模型
     *
     * @param type 结构体的class，必须为Entry的子类
     * @return 对应的结构体模型
     */
    MetaEntry getMetaEntry(Class<? extends Entry> type);

    /**
     * 查询某个link class对应的Link模型
     *
     * @param type 资源的class，必须为Link的子类
     * @return 对应的资源模型
     */
    MetaLink getMetaLink(Class<? extends Link> type);


    /**
     * 查询某个资源type对应的资源模型
     *
     * @param type 资源的 type ，必须为Resource的子类
     * @return 对应的资源模型
     */
    MetaResource getMetaResource(String type);

    /**
     * 获取某个分类下所有的资源模型
     *
     * @param category 分类名称
     * @return 资源模型集合
     */
    Set<MetaResource> getMetaResources(String category);

    /**
     * 由 Model Feature Resolver回调的解析入口方法
     *
     * @param klass 被解析的类
     */
    MetaModel resolve(Class klass) throws MetaException;


}
