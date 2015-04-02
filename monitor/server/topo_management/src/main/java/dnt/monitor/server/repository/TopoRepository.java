/**
 * Developer: Kadvin Date: 14/12/23 下午1:39
 */
package dnt.monitor.server.repository;

import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;
import org.apache.ibatis.annotations.Param;

/**
 * <h1>Topo Repository</h1>
 */
public interface TopoRepository {

    /**
     * <h2>根据指定的路径寻找相应的Topo Map</h2>
     *
     * @param path 路径
     * @return 找到的topo map，现在约束实现为某个路径（也就是节点暂时只有一个对应的topo map)
     * 以后可能会支持一个节点有多种展示Map
     */
    TopoMap findMapByPath(@Param("path") String path);

    /**
     * <h2>根据指定的Id寻找相应的Topo Map</h2>
     *
     * @param id ID
     * @return 找到的topo map，现在约束实现为某个路径（也就是节点暂时只有一个对应的topo map)
     * 以后可能会支持一个节点有多种展示Map
     */
    TopoMap findMapById(@Param("id") long id);

    /**
     * <h2>根据指定的路径寻找相应的Topo Node</h2>
     * <p/>
     * TODO 按照二次关联的查询原则，现有的查询语句没有把其直接关联的TopoLinks查出来
     *
     * @param path 路径
     * @return 找到的topo node，现在约束实现为某个路径（也就是节点暂时只有一个对应的topo node)
     * 以后可能会支持一个节点有多种展示Node
     */
    TopoNode findNodeByPath(@Param("path") String path);

    /**
     * <h2>根据id寻找Topo Node</h2>
     *
     * @param id Node ID
     * @return Topo Node
     */
    TopoNode findNodeById(@Param("id") Long id);

    /**
     * <h2>根据resource id寻找Topo Node</h2>
     *
     * @param resourceId Resource ID
     * @return Topo Node
     */
    TopoNode findNodeByResourceId(@Param("resourceId") long resourceId);

    /**
     * <h2>根据id寻找Topo Link</h2>
     *
     * @param id Link ID
     * @return Topo Link
     */
    TopoLink findLinkById(@Param("id") Long id);

    /**
     * <h2>根据底层Link对象的id寻找Topo Link</h2>
     *
     * @param underlyingLinkId 底层Link对象的ID
     * @return Topo Link
     */
    TopoLink findLinkByUnderlyingId(@Param("underlyingLinkId") Long underlyingLinkId);

    /**
     * <h2>创建一个Topo Map对象</h2>
     *
     * @param map 待创建的Topo Map对象
     */
    void createMap(TopoMap map);

    /**
     * <h2>创建一个Topo Node对象</h2>
     *
     * @param node 待创建的Topo Node对象
     */
    void createNode(TopoNode node);

    /**
     * <h2>创建一个Topo Link对象</h2>
     *
     * @param topoLink 待创建的Topo Link对象
     */
    void createLink(TopoLink topoLink);

    /**
     * <h2>更新一个Topo Map对象</h2>
     *
     * @param map 待更新的Topo Map对象
     */
    void updateMap(TopoMap map);

    /**
     * <h2>更新一个Topo Node对象</h2>
     *
     * @param node 待更新的Topo Node对象
     */
    void updateNode(TopoNode node);

    /**
     * <h2>更新一个Topo Link对象</h2>
     *
     * @param link 待更新的Topo Link对象
     */
    void updateLink(TopoLink link);

    /**
     * <h2>当ManagedNode的path变化时，修改相应的TopoMap的Path</h2>
     *
     * @param legacyPath 原来的路径
     * @param newPath    新的路径
     */
    void updateMapsPath(@Param("legacyPath") String legacyPath,
                        @Param("newPath") String newPath);

    /**
     * <h2>当ManagedNode的path变化时，修改相应的TopoNode的Path</h2>
     *
     * @param legacyPath 原来的路径
     * @param newPath    新的路径
     */
    void updateNodesPath(@Param("legacyPath") String legacyPath,
                         @Param("newPath") String newPath);

    /**
     * <h2>删除指定路径下的Topo Map，其下所有的Topo Node和Topo Link都会被基于数据库级联机制删除</h2>
     *
     * @param path map的路径
     */
    void deleteMap(@Param("path") String path);

    /**
     * <h2>删除指定路径下的Topo Node，其关联的所有Link都会被级联删除</h2>
     *
     * @param path Node的路径
     */
    void deleteNode(@Param("path") String path);

    /**
     * <h2>删除指定资源Link关联的某个Link</h2>
     *
     * @param underlyingLinkId 实际Link的id
     */
    void deleteLink(@Param("underlyingLinkId") Long underlyingLinkId);

    /**
     * <h2>更新特定map对象的子map数量</h2>
     *
     * @param mapId map的id
     * @param diff  变化的数量
     */
    void increaseMapSize(@Param("mapId") Long mapId, @Param("diff") int diff);

    /**
     * <h2>更新特定map对象的子node数量</h2>
     *
     * @param mapId map的id
     * @param diff  变化的数量
     */
    void increaseNodeSize(@Param("mapId") Long mapId, @Param("diff") int diff);

    /**
     * <h2>更新特定路径下的TopoMap的子节点数目(mapSize, nodeSize)</h2>
     *
     * @param path topo map的path
     */
    void updateMapsChildrenSize(@Param("path") String path);

    /**
     * <h2>更新newParentPath的直接子节点的map id为newParentPath对应的map的id</h2>
     *
     * @param newParentPath 新的父map的path
     */
    void updateNodesParent(String newParentPath);
}
