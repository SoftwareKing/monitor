/**
 * Developer: Kadvin Date: 14/12/23 下午9:52
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.Resource;
import net.happyonroad.platform.service.Pageable;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <h1>The resource repository</h1>
 *
 * Repository接口设计原则：
 *
 * <ol>
 *     <li>接口上面的参数尽量接近简单值，如 deleteById(long)，而不是 delete(Resource)
 *     <li>
 * </ol>
 */
public interface ResourceRepository<R extends Resource> {

    long countByType(@Param("type") String type);

    List<R> findAllByType( @Param("type") String type, @Param("request") Pageable request);

    /**
     * <h2>根据数据库ID查找资源对象
     *
     * @param id 数据库id
     * @return 资源对象，这个方法随着不同的资源类型，其信息会包括不同的内容
     */
    R findById(@Param("id") Long id);

    /**
     * <h2>根据address查找资源对象</h2>
     *
     * @param address address
     * @return 资源对象，这个方法随着不同的资源类型，其信息会包括不同的内容
     */
    R findByAddress(@Param("address") String address);

    /**
     * <h2>根据label查找资源对象</h2>
     *
     * @param label label
     * @return 资源对象，这个方法随着不同的资源类型，其信息会包括不同的内容
     */
    R findByLabel(String label);

    /**
     * <h2>单纯的创建资源记录</h2>
     *
     * @param resource 被创建的资源
     */
    void create(R resource);


    /**
     * <h2>单纯的更新资源记录</h2>
     *
     * @param resource 被更新的资源
     */
    void update(R resource);

    /**
     * <h2>单纯的删除资源记录</h2>
     *
     * @param id 被删除的资源记录
     */
    void deleteById(@Param("id")Long id);


}
