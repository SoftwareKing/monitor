/**
 * Developer: Kadvin Date: 15/2/16 下午2:14
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.engine.service.PolicyStore;
import dnt.monitor.engine.service.ResourceStore;
import dnt.monitor.exception.EngineException;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;
import dnt.monitor.service.ConfigurationService;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <h1>引擎部分的配置管理</h1>
 *
 */
@org.springframework.stereotype.Service
class ConfigurationManager extends Bean implements ConfigurationService {
    @Autowired
    NodeStore   nodeStore;
    @Autowired
    PolicyStore policyStore;
    @Autowired
    ResourceStore resourceStore;

    @Override
    public void assignNode(ManagedNode node) throws EngineException {
        ManagedNode exist = nodeStore.findByPath(node.getPath());
        if (exist != null) {
            logger.warn("The node path = {} exist, update it instead of assign", node.getPath());
            nodeStore.update(exist, node);
        } else {
            //对于服务器端新建的资源节点，引擎侧没有资源的id
            if( node instanceof ResourceNode ){
                ResourceNode resourceNode = (ResourceNode) node;
                //监控服务器这个资源对象，是服务器传过来的
                if( resourceNode.getResource() != null ){
                    try {
                        //如果系统不存在，则将其加入
                        resourceStore.findById(resourceNode.getResourceId());
                    } catch (IllegalArgumentException e) {
                        resourceStore.add(resourceNode.getResource());
                    }
                }
            }
            // 最后再将管理节点加入
            nodeStore.add(node);
        }
    }

    @Override
    public void assignResourceNode(ResourceNode node, String address) {
        Resource existResource = resourceStore.findByAddress(address);
        if( existResource == null ) {
            throw new IllegalStateException("Can't find any resource with address = '" + address + "'" );
        }
        resourceStore.updateResourceId(existResource, node.getResourceId());
        nodeStore.add(node);
    }

    @Override
    public void revokeNode(String path) throws EngineException {
        nodeStore.remove(path);
    }

    @Override
    public boolean isAssigned(String path) throws EngineException {
        return nodeStore.findByPath(path) != null;
    }

    @Override
    public void updateNode(ManagedNode node) throws EngineException {
        ManagedNode exist = nodeStore.findByPath(node.getPath());

        if( exist == null ){
            logger.warn("The node path = {} does not exist, add it instead of update", node.getPath());
            nodeStore.add(node);
        }else{
            nodeStore.update(exist, node);
        }
    }

    @Override
    public void moveNode(String legacyPath, ManagedNode node) {
        nodeStore.remove(legacyPath);
        nodeStore.add(node);
    }

    @Override
    public void createPolicy(ResourcePolicy policy) throws EngineException {
        ResourcePolicy exist = policyStore.findById(policy.getId());
        if (exist != null) {
            logger.warn("The policy id = {} exist, update it instead of create", policy.getId());
            policyStore.update(exist, policy);
        } else {
            policyStore.add(policy);
        }

    }

    @Override
    public void deletePolicy(Long policyId) throws EngineException {
        policyStore.remove(policyId);
    }

    @Override
    public void updatePolicy(ResourcePolicy policy) throws EngineException {
        ResourcePolicy exist = policyStore.findById(policy.getId());
        if( exist == null ){
            logger.warn("The resource policy id = {} does not exist, add it instead of update", policy.getId());
            policyStore.add(policy);
        }else{
            policyStore.update(exist, policy);
        }

    }
}
