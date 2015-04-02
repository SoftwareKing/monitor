/**
 * Developer: Kadvin Date: 15/2/15 下午6:48
 */
package dnt.monitor.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.Component;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.exception.ServiceException;
import org.apache.commons.collections.Predicate;

/**
 * <h1>采集引擎提供的配置服务</h1>
 *
 * Configuration中的assign/revoke都可以基于离线会话工作
 */
public interface ConfigurationService {
    /**
     * <h2>分配一个节点</h2>
     *
     * @param node 被分配的节点
     */
    void assignNode(ManagedNode node) throws EngineException;

    /**
     * <h2>回收一个节点</h2>
     *
     * @param node 被回收的节点
     */
    void revokeNode(ManagedNode node)throws EngineException;

    /**
     * <h2>判断某个路径对应的节点是否已经被本引擎记录下来了</h2>
     *
     * @param path 管理节点对应的路径
     * @return 是否已经被分配
     */
    boolean isAssigned(String path)throws EngineException;

    /**
     * <h2>由服务器端开始更新特定管理节点的管理属性</h2>
     *
     * @param node 管理节点
     */
    void updateNode(ManagedNode node)throws EngineException;

}
