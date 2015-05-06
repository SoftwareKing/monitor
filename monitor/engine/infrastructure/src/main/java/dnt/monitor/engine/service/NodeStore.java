/**
 * Developer: Kadvin Date: 15/1/29 下午5:31
 */
package dnt.monitor.engine.service;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.ResourceNode;

/**
 * <h1>引擎侧存储管理节点的容器</h1>
 */
public interface NodeStore {
    /**
     * <h2>根据路径查找节点</h2>
     *
     * @param path 节点的路径
     * @return 找到的节点，如果没有找到，则返回null
     */
    ManagedNode findByPath(String path);

    /**
     * <h2>根据资源id查找资源节点</h2>
     *
     * @param id 资源的id
     * @return 找到的节点，如果没有找到，则返回null
     */
    ResourceNode findByResourceId(Long id);

    /**
     * <h2>增加一个分配过来的管理节点</h2>
     *
     * @param node 被分配过来的管理节点
     */
    void add(ManagedNode node);

    /**
     * <h2>更新一个已经被分配过来的管理节点</h2>
     *
     * @param exist 已经存在的节点
     * @param node  更新的节点
     */
    void update(ManagedNode exist, ManagedNode node);

    /**
     * <h2>移除一个已经存在的节点</h2>
     *
     * @param path 被移除的节点
     */
    void remove(String path);

    /**
     * <h2>将某个节点与其上级节点合并</h2>
     *
     * @param node 节点
     * @return 合并后的节点
     */
    <T extends ManagedNode> T merge(T node);

}
