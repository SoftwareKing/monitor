/**
 * Developer: Kadvin Date: 14/12/23 下午1:21
 */
package dnt.monitor.server.service;

import dnt.monitor.model.Link;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;

/**
 * <h1>Topo服务接口</h1>
 */
public interface TopoService {
    /**
     * <h2>加载特定路径对应的Topo Map对象，包括其中的TopoNode(s)和TopoLink(s)</h2>
     *
     * @param path Topo Map的路径
     * @return 加载完成的Topo Map
     */
    TopoMap findMapByPath(String path);

    /**
     * <h2>加载特定路径对应的Topo Node对象</h2>
     * <p/>
     * 备注：这个接口暂时不符合Mybatis映射规则：不包括其直接关联对象：TopoMap
     *
     * @param path Topo Node 的路径
     * @return 加载完成的Topo Node
     */
    TopoNode findNodeByPath(String path);

    /**
     * <h2>根据数据库id查询相应的Topo节点</h2>
     *
     * @param nodeId Topo节点的数据库ID
     * @return Topo Node对象
     */
    TopoNode findNodeById(Long nodeId);

    /**
     * <h2>根据资源的数据库id查找相应的TopoNode</h2>
     * <p/>
     * 以后支持一个资源多个Node时，该接口会有问题(需要增加一个tag)
     *
     * @param resourceId 资源的数据库id
     * @return Topo Node
     */
    TopoNode findNodeByResourceId(long resourceId);

    /**
     * <h2>根据数据库id查询相应的Topo链路</h2>
     *
     * @param linkId Topo链路的数据库ID
     * @return Topo Link对象
     */
    TopoLink findLinkById(Long linkId);

    /**
     * <h2>创建Topo Map对象</h2>
     * 当系统监听到 type 为 Range/Group 的节点本创建时，需要自动通过本API为其创建Map
     *
     * @param map 需要创建的Topo Map
     */
    void createMap(TopoMap map) throws TopoException;

    /**
     * <h2>创建Topo Node对象</h2>
     * 当系统监听到 type 为 Resource 的管理节点创建时，需要自动通过本API为其创建Node
     *
     * @param map  Node所在的map（为存在的对象）
     * @param node 需要创建的Topo Node
     */
    void createNode(TopoMap map, TopoNode node) throws TopoException;


    /**
     * <h2>创建Topo Link对象</h2>
     * 当系统监听到 Link 创建时，需要自动通过本API为其对应的TopoNode(s)建立 Topo Link
     *
     * @param fromTopoNode 源Topo节点
     * @param toTopoNode   目标Topo节点
     * @param link         链接对象
     */
    TopoLink createLink(TopoNode fromTopoNode, TopoNode toTopoNode, Link link) throws TopoException;

    /**
     * <h2>创建Topo Link对象</h2>
     * 当系统监听到 Link 创建时，需要自动通过本API为其对应的TopoNode(s)建立 Topo Link
     *
     * @param fromNode 源Topo节点
     * @param toNode   目标Topo节点
     * @param type     Topo Link Type
     * @param label    Topo Link Label
     */
    TopoLink createLink(TopoNode fromNode, TopoNode toNode, String type, String label) throws TopoException;

    /**
     * <h2>更新Topo Map</h2>
     *
     * @param map      需要更新的Topo Map
     * @param updating 更新的Topo Map
     */
    TopoMap updateMap(TopoMap map, TopoMap updating) throws TopoException;

    /**
     * <h2>更新Topo Node</h2>
     *
     * @param exist    原有的节点
     * @param updating 需要更新的Topo Node
     */
    TopoNode updateNode(TopoNode exist, TopoNode updating) throws TopoException;

    /**
     * <h2>更新Topo Link</h2>
     *
     * @param exist 已有的Link对象
     * @param link  需要更新的Link对象
     * @return 更新之后的Link对象
     * @throws TopoException
     */
    TopoLink updateLink(TopoLink exist, TopoLink link) throws TopoException;

    /**
     * <h2>当ManagedNode的path变化时，修改相应的TopoMap/Node的Path</h2>
     * 这个机制本来也可以通过数据库的外键约束: ON UPDATE CASCADE解决
     *
     * @param oldPath 原来的路径
     * @param newPath 新的路径
     */
    void updatePath(String oldPath, String newPath);

    /**
     * <h2>删除Topo Map</h2>
     * 当系统监听到 type 为 Range/Group 的节点删除时，需要自动通过本API删除其对应的Map
     *
     * @param path 需要删除的Topo Map
     */
    void deleteMap(String path) throws TopoException;

    /**
     * <h2>删除Topo Node</h2>
     * 当系统监听到 type 为 Resource 的节点删除时，需要自动通过本API删除其对应的Node
     *
     * @param path 需要删除的Topo Node
     */
    void deleteNode(String path) throws TopoException;

    /**
     * <h2>根据实际Link对象删除相应的TopoLink对象</h2>
     *
     * @param link 资源层实际的Link对象
     */
    void deleteLink(Link link) throws TopoException;

}
