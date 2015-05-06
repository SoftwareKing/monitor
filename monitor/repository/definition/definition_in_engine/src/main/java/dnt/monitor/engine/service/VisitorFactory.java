package dnt.monitor.engine.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.service.Visitor;
import net.happyonroad.model.Credential;
import org.springframework.core.PriorityOrdered;

/**
 * <h1>缺省的资源/设备访问工厂接口定义</h1>
 *
 * @author Jay Xiong
 */
public interface VisitorFactory<C extends Credential, V extends Visitor> extends PriorityOrdered {
    /**
     * <h2>判断本访问工厂是否支持特定的地址</h2>
     *
     * @param address 地址
     * @return 是否支持
     */

    boolean support(String address);
    /**
     * <h2>判断本访问工厂是否支持特定访问方式</h2>
     *
     * @param credential 访问方式
     * @return 是否支持
     */
    boolean support(Credential credential);

    /**
     * <h2>获取某个分组节点下特定设备的访问器</h2>
     * <p/>
     * 由于此时设备可能尚未创建，所以无法直接基于设备对应的ResourceNode进行访问
     *
     * @param scopeNode  设备所属的分组
     * @param device     设备对象
     * @param credential 访问设备所用的认证信息
     * @return 对设备的访问器
     */
    V visitor(GroupNode scopeNode, Resource device, C credential) throws EngineException;

    /**
     * <h2>获取访问某个资源节点的访问器</h2>
     *
     * @param resourceNode 资源节点，里面存储了访问该资源所需要的管理信息；以及关联设设备对象
     * @param credential   访问设备所用的认证信息
     * @return 对设备的访问器
     */
    V visitor(ResourceNode resourceNode, C credential) throws EngineException;

    /**
     * <h2>交还访问器</h2>
     *
     * @param visitor 前述被借走的访问器
     */
    void returnBack(V visitor);

}
