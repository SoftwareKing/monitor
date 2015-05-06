/**
 * Developer: Kadvin Date: 15/1/29 下午5:31
 */
package dnt.monitor.engine.service;

import dnt.monitor.model.Device;
import dnt.monitor.model.Resource;

/**
 * <h1>引擎侧存储资源的容器</h1>
 */
public interface ResourceStore {
    /**
     * <h2>根据地址查找设备对象</h2>
     * <p/>
     * 查到第一个就返回
     *
     * @param address 设备的地址
     * @return 找到的设备，如果没有找到，则返回null
     */
    Resource findByAddress(String address);

    /**
     * <h2>根据id查找资源</h2>
     *
     * @param resourceId 资源id
     * @return 找到的资源，如果没有找到，会抛出 IllegalArgumentException
     */
    Resource findById(Long resourceId);

    /**
     * <h2>增加资源</h2>
     *
     * @param resource 新增的资源
     */
    void add(Resource resource);

    /**
     * <h2>更新资源</h2>
     *
     * @param exist    已经存在的资源
     * @param resource 更新的资源
     */
    void update(Resource exist, Resource resource);

    /**
     * <h2>更新资源的id</h2>
     *
     * @param resource   更新的资源
     * @param resourceId 资源新的id
     */
    void updateResourceId(Resource resource, Long resourceId);

    /**
     * <h2>移除资源</h2>
     *
     * @param resource 被移除的资源
     */
    void remove(Resource resource);
}
