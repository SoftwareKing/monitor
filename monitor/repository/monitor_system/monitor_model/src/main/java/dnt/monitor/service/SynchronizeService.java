/**
 * Developer: Kadvin Date: 15/2/16 下午2:26
 */
package dnt.monitor.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.Component;
import dnt.monitor.model.Resource;
import org.apache.commons.collections.Predicate;

/**
 * <h1>主动同步的服务</h1>
 */
public interface SynchronizeService {

    /**
     * <h2>同步一个节点</h2>
     * <p/>
     * 实质是由设备开始更新一个资源的属性，组件，关系
     * <p/>
     * 同步之后，资源的类型都可能会变化
     *
     * @param nodePath 被同步的节点的路径
     * @return 相应的资源信息
     */
    Resource syncNode(String nodePath)throws EngineException;

    /**
     * <h2>同步某个节点下的特定组件的信息</h2>
     *
     * @param nodePath  节点的路径
     * @param component 组件对象
     * @return 填充完成各种属性的组件的实例
     */
    Component syncComponent(String nodePath, Component component)throws EngineException;

    /**
     * <h2>同步某个节点下特定的组件(s)的信息</h2>
     *
     * @param nodePath  节点的路径
     * @param predicate 针对组件的过滤器
     * @return 更新了相应的组件之后的资源对象
     */
    Resource syncComponents(String nodePath, Predicate predicate)throws EngineException;
}
