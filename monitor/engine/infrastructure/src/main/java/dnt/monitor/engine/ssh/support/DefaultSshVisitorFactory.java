package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.service.ErrorCodes;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.spring.Bean;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.pool.impl.GenericKeyedObjectPool;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * <h1>The ssh visitor factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultSshVisitorFactory extends Bean implements SshVisitorFactory{
    protected Map<String, GenericKeyedObjectPool<SshCredential, SshVisitor>> pools;

    public DefaultSshVisitorFactory() {
        pools = new HashMap<String, GenericKeyedObjectPool<SshCredential, SshVisitor>>();
    }

    @Override
    public SshVisitor visitor(ResourceNode node, SshCredential credential) throws SshException {
        GenericKeyedObjectPool<SshCredential, SshVisitor> pool = pools.get(node.getPath());
        if( pool == null ){
            NodeConnectionFactory factory = new NodeConnectionFactory(node);
            // TODO 增加关于该节点的资源管理
            // 具体资源管理的内容，主要是根据node上的控制参数进行管理
            pool = new GenericKeyedObjectPool<SshCredential, SshVisitor>(factory);
            pools.put(node.getPath(), pool);
        }
        try {
            return pool.borrowObject(credential);
        } catch (Exception e) {
            throw new SshException(ErrorCodes.RESOURCE_NOT_AVAILABLE,
                                   "Can't borrow ssh visitor for " + node.getPath(), e);
        }
    }

    @Override
    public void returnBack(ResourceNode node, SshVisitor visitor){
        GenericKeyedObjectPool<SshCredential, SshVisitor> pool = pools.get(node.getPath());
        if( pool == null ){
            logger.warn("Return a {} under path {}, but the pool is not created", visitor, node);
            return;
        }
        SshCredential credential = node.getCredential(SshCredential.class);
        try {
            pool.returnObject(credential, visitor);
        } catch (Exception e) {
            logger.warn("Can't return {} back to {}, because of {} ",
                        visitor,  node.getPath(), ExceptionUtils.getRootCauseMessage(e));
        }
    }

    @Override
    public SshVisitor visitor(ResourceNode node, LocalCredential credential) throws SshException{
        throw new UnsupportedOperationException("The local shell is not supported now");
    }


}
