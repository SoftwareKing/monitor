/**
 * Developer: Kadvin Date: 15/1/29 下午5:31
 */
package dnt.monitor.engine.service;

import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;

import java.util.List;

/**
 * <h1>引擎侧存储管理节点的容器</h1>
 */
public interface PolicyStore {
    /**
     * <h2>找到能匹配特定类型所有的资源策略</h2>
     *
     * 父策略也会被选择出来
     *
     * @param type 资源类型
     * @return 匹配特定类型所有的资源策略
     */
    List<ResourcePolicy> findAllByType(String type);

    /**
     * <h2>根据id找资源策略</h2>
     *
     * @param id 资源策略的路径
     * @return 找到的资源策略，如果没有找到，则返回null
     */
    ResourcePolicy findById(Long id);

    /**
     * <h2>增加一个资源策略</h2>
     *
     * @param policy 被分配过来的资源策略
     */
    void add(ResourcePolicy policy);

    /**
     * <h2>更新一个已经被分配过来的管理节点 </h2>
     *
     * @param exist  已经存在的资源策略
     * @param policy 更新的资源策略
     */
    void update(ResourcePolicy exist, ResourcePolicy policy);

    /**
     * <h2>移除一个已经存在的资源策略</h2>
     *
     * @param policyId 被移除的资源策略
     */
    void remove(Long policyId);

    /**
     * <h2>查找到某个资源节点最匹配的策略</h2>
     *
     * @param resourceNode 资源节点，该节点信息已经和上级节点合并过，并且包括了对资源的引用
     * @return 匹配的资源策略
     */
    ResourcePolicy match(ResourceNode resourceNode);
}
