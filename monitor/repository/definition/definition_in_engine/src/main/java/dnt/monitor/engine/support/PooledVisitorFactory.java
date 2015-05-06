package dnt.monitor.engine.support;

import dnt.monitor.service.Visitor;
import dnt.monitor.engine.service.VisitorFactory;
import dnt.monitor.exception.SampleException;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.model.Credential;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.pool.KeyedPoolableObjectFactory;
import org.apache.commons.pool.impl.GenericKeyedObjectPool;

import java.util.HashMap;
import java.util.Map;

/**
 * <h1>管理有限资源的访问者工厂</h1>
 *
 * 有限资源往往对应底层有一个Socket连接，如 SSH访问，JDBC访问
 *
 * @author Jay Xiong
 */
public abstract class PooledVisitorFactory<C extends Credential, V extends Visitor<C>>
        extends Bean implements VisitorFactory<C,V> {

    //可以用多种方式访问特定目标
    protected Map<String, GenericKeyedObjectPool<C, V>> pools;

    public PooledVisitorFactory() {
        pools = new HashMap<String, GenericKeyedObjectPool<C, V>>();
    }

    @Override
    public V visitor(ResourceNode node, C credential) throws SampleException {
        return innerVisitor(node, node.getResource(), credential);
    }

    @Override
    public V visitor(GroupNode node, Resource device, C credential) throws SampleException {
        return innerVisitor(node, device, credential);
    }

    protected V innerVisitor(ManagedNode node, Resource resource, C credential) throws SampleException {
        String address = resourceKey(resource);
        GenericKeyedObjectPool<C, V> pool = pools.get(address);
        if( pool == null ){
            // TODO 增加关于该节点的资源管理
            // 具体资源管理的内容，主要是根据node上的控制参数进行管理
            KeyedPoolableObjectFactory<C, V> factory = createPoolFactory(node, resource);
            pool = new GenericKeyedObjectPool<C, V>(factory);
            pools.put(address, pool);
        }
        try {
            V visitor = pool.borrowObject(credential);
            //keep the visitor's resource newest
            visitor.setResource(resource);
            return visitor;
        } catch (Exception e) {
            throw new SampleException("Can't borrow visitor for " + address + " by " + credential, e);
        }
    }

    protected abstract KeyedPoolableObjectFactory<C,V> createPoolFactory(ManagedNode node,
                                                                         Resource device) throws SampleException;

    @Override
    public void returnBack(V visitor){
        if(visitor==null){
            return;
        }
        String key = resourceKey(visitor.getResource());
        GenericKeyedObjectPool<C, V> pool = pools.get(key);
        if( pool == null ){
            logger.warn("Return a {} under key {}, but the pool is not created", visitor, key);
            return;
        }
        C credential = visitor.getCredential();
        try {
            pool.returnObject(credential, visitor);
        } catch (Exception e) {
            logger.warn("Can't return {} back to {}, because of {} ",
                        visitor, key, MiscUtils.describeException(e));
        }
    }

    protected String resourceKey(Resource resource){
        return resource.getAddress();
    }

}
