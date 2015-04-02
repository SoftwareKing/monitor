/**
 * Developer: Kadvin Date: 15/1/29 下午5:31
 */
package dnt.monitor.engine.service;

import dnt.monitor.model.ManagedNode;

/**
 * <h1>引擎侧存储管理节点的容器</h1>
 */
public interface NodeStore {
    /**
     * 根据路径查找节点
     *
     * @param path 节点的路径
     * @return 找到的节点，如果没有找到，则返回null
     */
    ManagedNode findByPath(String path);

    /**
     * 增加一个分配过来的管理节点
     *
     * @param node 被分配过来的管理节点
     */
    void add(ManagedNode node);

    /**
     * 更新一个已经被分配过来的管理节点
     *
     * @param exist 已经存在的节点
     * @param node  更新的节点
     */
    void update(ManagedNode exist, ManagedNode node);

    /**
     * 移除一个已经存在的节点
     *
     * @param node 被移除的节点
     */
    void remove(ManagedNode node);
}
