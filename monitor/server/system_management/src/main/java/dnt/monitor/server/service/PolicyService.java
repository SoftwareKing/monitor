package dnt.monitor.server.service;

import dnt.monitor.exception.PolicyException;
import dnt.monitor.policy.ResourcePolicy;

import java.util.List;

/**
 * <h1>策略服务</h1>
 *
 * @author Jay Xiong
 */
public interface PolicyService {
    /**
     * <h2>加载所有的策略</h2>
     *
     * @return 策略列表
     */
    List<ResourcePolicy> findAll();

    /**
     * <h2>加载某个资源类型下所有的策略</h2>
     *
     * @param resourceType 资源类型
     * @return 策略列表
     */
    List<ResourcePolicy> findAllByResourceType(String resourceType);

    /**
     * <h2>加载策略</h2>
     *
     * @param id 策略id
     * @return 面向某个模型的策略
     */
    ResourcePolicy findById(Long id);

    /**
     * <h2>创建一个模型的策略</h2>
     *
     * @param policy 面向某个模型的策略
     */
    void create(ResourcePolicy policy) throws PolicyException;

    /**
     * <h2>更新一个模型的策略</h2>
     *
     * @param legacy 原来的策略
     * @param policy 被更新的策略
     */
    void update(ResourcePolicy legacy, ResourcePolicy policy) throws PolicyException;

    /**
     * <h2>删除模型的策略</h2>
     *
     * @param id 被删除的策略id
     */
    void deleteById(Long id) throws PolicyException;

}
