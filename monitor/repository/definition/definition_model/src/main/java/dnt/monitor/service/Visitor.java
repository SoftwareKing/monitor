package dnt.monitor.service;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.model.Credential;

/**
 * <h1>Abstract Visitor</h1>
 *
 * @author mnnjie
 */
public interface Visitor<C extends Credential> {
    /**
     * <h2>被访问的资源所属的管理节点</h2>
     *
     * @return 可能是群组节点（对于尚未入库的资源），也可能是资源节点（已经入库的资源）
     */
    ManagedNode getNode();

    /**
     * <h2>实际被访问资源</h2>
     *
     * @return 资源
     */
    Resource getResource();

    /**
     * <h2>访问资源的认证信息 </h2>
     *
     * @return 认证信息
     */
    C getCredential();

    /**
     * <h2>判断该Visitor对应的资源是否可用</h2>
     *
     * @return 是否可用
     */
    boolean isAvailable();

    /**
     * <h2>释放相应的visitor</h2>
     */
    void close();

    void setResource(Resource resource);
}
