package dnt.monitor.server.repository;

import dnt.monitor.policy.ComponentPolicy;
import dnt.monitor.policy.ResourcePolicy;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <h1>Policy Repository</h1>
 * <p/>
 * 本对象不遵循二次关联约束，无论是findAll还是findOne，都一下抓取所有数据
 *
 * @author Jay Xiong
 */
public interface PolicyRepository {
    /**
     * <h2>加载所有的策略</h2>
     *
     * @return 策略列表
     */
    List<ResourcePolicy> findAll();

    /**
     * <h2>查找到某个资源类型下所有的策略</h2>
     *
     * @param resourceType 资源类型
     * @return 找到的资源策略，包括其组件策略
     */
    List<ResourcePolicy> findAllByResourceType(@Param("resourceType") String resourceType);

    /**
     * <h2>加载策略</h2>
     *
     * @param id 策略id
     * @return 面向某个模型的策略
     */
    ResourcePolicy findById(@Param("id") Long id);

    /**
     * <h2>创建一个模型的策略</h2>
     *
     * @param policy 面向某个模型的策略
     */
    void create(ResourcePolicy policy);

    /**
     * <h2>更新一个模型的策略</h2>
     *
     * @param policy 被更新的策略
     */
    void update(ResourcePolicy policy);

    /**
     * <h2>删除模型的策略</h2>
     *
     * @param id 被删除的策略id
     */
    void deleteById(@Param("id") Long id);

    /**
     * <h2>创建资源策略下面的组件策略</h2>
     *
     * @param componentPolicy 组件策略
     */
    void createComponentPolicy(ComponentPolicy componentPolicy);

    /**
     * <h2>更新资源策略下的特定组件策略</h2>
     *
     * @param componentPolicy 组件策略
     */
    void updateComponentPolicy(ComponentPolicy componentPolicy);

    /**
     * <h2>删除资源策略下的特定的组件策略</h2>
     *
     * @param componentPolicy 组件策略
     */
    void deleteComponentPolicy(ComponentPolicy componentPolicy);

    int count();
}
