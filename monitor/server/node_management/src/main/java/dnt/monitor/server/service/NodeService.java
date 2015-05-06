/**
 * Developer: Kadvin Date: 14/12/22 上午10:43
 */
package dnt.monitor.server.service;

import dnt.monitor.model.*;
import dnt.monitor.server.exception.NodeException;

import java.util.List;

/**
 *  管理节点的服务API
 */
public interface NodeService {
    /**
     * <h2>根据路径查找相应的管理节点</h2>
     *
     * @param path 管理节点路径
     * @return 对应的管理节点
     * @throws java.lang.IllegalArgumentException 如果没有对应的节点
     */
    ManagedNode findByPath(String path);

    /**
     * <h2>查找特定节点的子节点</h2>
     *
     * @param parent 管理节点
     * @param depth  子节点的深度
     * @param leaf   是否包括叶子节点
     * @return 所有子节点列表
     */
    List<ManagedNode> findSubNodes(ManagedNode parent, int depth, boolean leaf);

    /**
     * 将查询到的管理节点信息与其上级节点合并
     *
     * @param node   被合并的管理节点
     * @param parent 其上级节点对象
     */
    void merge(ManagedNode node, ManagedNode parent);

    /**
     * 在某个父节点之下创建子节点
     * <p/>
     * 不应该直接在根节点下创建引擎节点，而是引擎注册后，自动为其创建管理节点以及群组范围节点
     * 不应该在Range节点下创建资源节点，这应该是引擎发现资源后，向服务器注册后，自动为相应的资源创建管理节点
     *
     * @param parent 父节点
     * @param node   需要创建的子节点
     * @return 新建的子节点
     */
    ManagedNode create(ManagedNode parent, ManagedNode node) throws NodeException;

    /**
     * <h2>更新管理节点信息</h2>
     *
     * @param targetNode 原有的管理节点
     * @param inputNode  新的管理节点
     * @return 更新后的管理节点信息
     */
    ManagedNode update(ManagedNode targetNode, ManagedNode inputNode) throws NodeException;

    /**
     * <h2>删除特定管理节点</h2>
     *
     * @param node 被删除的管理节点对象
     */
    void delete(ManagedNode node) throws NodeException;

    void delete(ManagedNode node, boolean force) throws NodeException;

    /**
     * <h2>删除特定管理节点，以及其所有的子节点</h2>
     *
     * @param node 被删除的管理节点对象
     */
    void deleteHierarchy(ManagedNode node) throws NodeException;

    /**
     * <h2>根据资源的ID找到对应的管理节点</h2>
     *
     * @param resourceId 资源的ID
     * @return 对应的管理节点
     */
    ResourceNode findByResourceId(Long resourceId);

    /**
     * 根据子网地址查找相应的range节点
     *
     * @param subnet 192.168.1.0/16这种形式的子网地址
     * @return 子网节点
     */
    RangeNode findRangeNodeBySubnet(String subnet);

    /**
     * 根据某个资源查找到其对应的引擎管理节点
     *
     * @param resource 资源对象
     * @return 引擎
     */
    MonitorEngine findEngineByResource(Resource resource) throws NodeException;


    /**
     * 根据某个节点查找到其对应的引擎管理节点
     *
     * @param node 节点对象
     * @return 引擎
     */
    MonitorEngine findEngineByNode(ManagedNode node) throws NodeException;

    /**
     * 根据某个节点查找到其对应的引擎管理节点
     *
     * @param enginePath Engine node path
     * @return 引擎
     */
    MonitorEngine findEngineByPath(String enginePath) throws NodeException;

    /**
     * <h2>更新一系列节点的路径</h2>
     *
     * @param legacyPath 原有的路径，结尾不带 "/"
     * @param newPath    新的路径开头，结尾不带 "/"
     */
    void updateNodesPath(String legacyPath, String newPath) throws NodeException;

    /**
     * <h2>对特定节点进行发现</h2>
     * <ul>
     * <li>如果节点是特定资源，则对资源进行发现；
     * <li>如果节点是range，则对range进行发现；
     * <li>如果节点是group，则对group下的每个节点进行递归
     * <li>如果节点是根节点，暂时不支持发现</li>
     * </ul>
     * @param node 被发现的节点
     * @throws NodeException
     */
    void discover(ManagedNode node) throws NodeException;

}
