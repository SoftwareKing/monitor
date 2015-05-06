/**
 * Developer: Kadvin Date: 15/2/15 下午6:48
 */
package dnt.monitor.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;

/**
 * <h1>采集引擎提供的配置服务</h1>
 * <p/>
 * 包括对node，policy的管理, 该服务多数接口，可以基于离线会话工作
 */
public interface ConfigurationService {
    /**
     * <h2>分配一个节点</h2>
     *
     * @param node 被分配的节点
     */
    void assignNode(ManagedNode node) throws EngineException;

    /**
     * <h2>分配一个资源节点</h2>
     * 对于引擎侧已经存在相应资源，后继创建的节点被分配过来
     * node#resource 为null
     *
     * @param node    被分配的资源节点
     * @param address 资源的路径
     */
    void assignResourceNode(ResourceNode node, String address);

    /**
     * <h2>回收一个节点</h2>
     *
     * @param path 被回收的节点
     */
    void revokeNode(String path) throws EngineException;

    /**
     * <h2>由服务器端开始更新特定管理节点的管理属性</h2>
     *
     * @param node 管理节点
     */
    void updateNode(ManagedNode node) throws EngineException;

    /**
     * <h2>当某个节点的路径变化时，在引擎侧调整其路径</h2>
     *
     * @param legacyPath 原始路径
     * @param node       新的节点信息(不包括与上级节点的merge)
     */
    void moveNode(String legacyPath, ManagedNode node);

    /**
     * <h2>判断某个路径对应的节点是否已经被本引擎记录下来了</h2>
     *
     * @param path 管理节点对应的路径
     * @return 是否已经被分配
     */
    boolean isAssigned(String path) throws EngineException;

    /**
     * <h2>由服务器端开始通知引擎有新的资源策略被构建</h2>
     *
     * @param policy 资源策略
     */
    void createPolicy(ResourcePolicy policy) throws EngineException;

    /**
     * <h2>由服务器端开始通知引擎有资源策略被删除</h2>
     *
     * @param policyId 资源策略的id
     */
    void deletePolicy(Long policyId) throws EngineException;

    /**
     * <h2>由服务器端开始通知引擎有资源策略被更新</h2>
     *
     * @param policy 资源策略
     */
    void updatePolicy(ResourcePolicy policy) throws EngineException;
}
