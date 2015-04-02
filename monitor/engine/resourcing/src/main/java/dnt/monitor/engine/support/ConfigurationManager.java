/**
 * Developer: Kadvin Date: 15/2/16 下午2:14
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.exception.EngineException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.service.ConfigurationService;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <h1>引擎部分的配置管理</h1>
 */
@org.springframework.stereotype.Service
class ConfigurationManager extends Bean implements ConfigurationService {
    @Autowired
    NodeStore store;


    @Override
    public void assignNode(ManagedNode node) throws EngineException {
        ManagedNode exist = store.findByPath(node.getPath());
        if( exist != null ){
            logger.warn("The node path = {} exist, update it instead of assign", node.getPath());
            store.update(exist, node);
        } else {
            store.add(node);
        }
    }

    @Override
    public void revokeNode(ManagedNode node) throws EngineException {
        store.remove(node);
    }

    @Override
    public boolean isAssigned(String path) throws EngineException {
        return store.findByPath(path) != null;
    }

    @Override
    public void updateNode(ManagedNode node) throws EngineException {
        ManagedNode exist = store.findByPath(node.getPath());
        if( exist == null ){
            logger.warn("The node path = {} does not exist, add it instead of update", node.getPath());
            store.add(node);
        }else{
            store.update(exist, node);
        }
    }
}
