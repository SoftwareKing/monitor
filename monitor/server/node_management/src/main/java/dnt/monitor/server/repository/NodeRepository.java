/**
 * Developer: Kadvin Date: 14/12/22 下午7:03
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.RangeNode;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 管理节点仓库API
 */
public interface NodeRepository {
    ManagedNode findByPath(@Param("path") String path);

    ManagedNode findByResourceId(@Param("resourceId") Long resourceId);

    List<ManagedNode> findAllByPath(@Param("path") String path,
                                    @Param("parentDepth") int parentDepth,
                                    @Param("depth") int depth,
                                    @Param("leaf") boolean leaf);

    RangeNode findByRange(@Param("range") String range);

    // id, path, resource 均是不可以修改的
    int update(ManagedNode node);

    void create(ManagedNode node);

    void delete(ManagedNode node);

    void updateNodesPath(@Param("legacyPath") String legacyPath,
                         @Param("newPath") String newPath,
                         @Param("diff") int diff);

    /**
     * <h2>统计某个节点的直接组节点数量</h2>
     *
     * @param path 被统计的群组节点
     * @return 直接组节点数量
     */
    int countGroupSize(@Param("path") String path);

    /**
     * <h2>统计某个节点的直接资源节点数量</h2>
     *
     * @param path 被统计的群组节点
     * @return 直接资源节点数量
     */
    int countResourceSize(@Param("path") String path);

    /**
     * <h2>手工更新某个节点的直接群组/资源节点数量</h2>
     *
     * @param path         被更新的群组节点
     * @param groupSize    直接组节点数量
     * @param resourceSize 直接资源节点数量
     */
    void updateNodeChildrenSize(@Param("path") String path,
                                @Param("groupSize") int groupSize,
                                @Param("resourceSize") int resourceSize);

    /**
     * <h2>手工更新某个节点的直接群组节点数量</h2>
     *
     * @param path 被更新的群组节点
     * @param diff 变化的组节点数量
     */
    void increaseNodeGroupSize(@Param("path") String path, @Param("diff") int diff);

    /**
     * <h2>手工更新某个节点的直接资源节点数量</h2>
     *
     * @param path 被更新的群组节点
     * @param diff 变化的资源节点数量
     */
    void increaseNodeResourceSize(@Param("path") String path, @Param("diff") int diff);
}
