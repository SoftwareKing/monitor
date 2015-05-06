/**
 * Developer: Kadvin Date: 15/1/29 下午5:38
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.PolicyStore;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;
import net.happyonroad.cache.CacheService;
import net.happyonroad.cache.MapContainer;
import net.happyonroad.event.*;
import net.happyonroad.model.Record;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.DiffUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import java.util.*;

import static net.happyonroad.support.BinarySupport.parseBinary;
import static net.happyonroad.support.BinarySupport.toBinary;

/**
 * <h1>缺省的资源策略存储器</h1>
 *
 * 当下以 redis hash为存储形态
 */
@Component
@ManagedResource("dnt.monitor.engine:type=store,name=policyStore")
public class DefaultPolicyStore extends ApplicationSupportBean implements PolicyStore {
    @Autowired
    CacheService cacheService;

    // id -> Policy
    MapContainer container;
    Map<Long, ResourcePolicy> policies;

    @Override
    protected void performStart() {
        super.performStart();
        container = cacheService.getMapContainer(getClass().getSimpleName());
        policies = new HashMap<Long, ResourcePolicy>();
        for (String id : container.keys()) {
            byte[] bytes = container.getBinary(id);
            if (bytes != null) {
                ResourcePolicy policy = parseBinary(bytes, ResourcePolicy.class);
                policies.put(Long.valueOf(id), policy);
            }
        }
    }

    @Override
    public ResourcePolicy findById(Long id) {
        logger.debug("Finding  resource policy by {}", id);
        ResourcePolicy policy = policies.get(id);
        logger.debug("Found    {}", policy);
        return policy;
    }

    @Override
    public void add(ResourcePolicy policy) {
        logger.info("Adding {}", policy);
        publishEvent(new ObjectCreatingEvent<ResourcePolicy>(policy));
        try {
            policies.put(policy.getId(), policy);
            container.put(String.valueOf(policy.getId()), toBinary(policy));
        } catch (RuntimeException e) {
            logger.error("Failed to add {}, because of {}", policy, e.getMessage());
            publishEvent(new ObjectCreateFailureEvent<ResourcePolicy>(policy, e));
            throw e;
        }
        publishEvent(new ObjectCreatedEvent<ResourcePolicy>(policy));
        logger.info("Added  {}", policy);
    }

    @Override
    public void update(ResourcePolicy exist, ResourcePolicy policy) {
        logger.info("Updating {} to {}", exist, policy);
        publishEvent(new ObjectUpdatingEvent<ResourcePolicy>(exist, policy));
        try {
            policies.put(policy.getId(), policy);
            container.put(String.valueOf(policy.getId()), toBinary(policy) );
        } catch (RuntimeException e) {
            logger.error("Failed to update {}, because of {}", policy, e.getMessage());
            publishEvent(new ObjectUpdateFailureEvent<ResourcePolicy>(exist, policy, e));
            throw e;
        }
        publishEvent(new ObjectUpdatedEvent<ResourcePolicy>(policy, exist));
        if( logger.isInfoEnabled() ){
            logger.info("Updated  {} by {}", exist, DiffUtils.describeDiff(exist, policy, Record.HELP_ATTRS));
        }
    }

    @Override
    public void remove(Long policyId) {
        ResourcePolicy policy = findById(policyId);
        if( policy == null ){
            logger.warn("There is no resource policy with id = {}", policyId);
            return;
        }
        logger.warn("Removing {}", policy );
        publishEvent(new ObjectDestroyingEvent<ResourcePolicy>(policy));
        try {
            policies.remove(policyId);
            container.remove(String.valueOf(policyId));
        } catch (RuntimeException e) {
            logger.error("Failed to remove {}, because of {}", policy, e.getMessage());
            publishEvent(new ObjectDestroyFailureEvent<ResourcePolicy>(policy, e));
            throw e;
        }
        publishEvent(new ObjectDestroyedEvent<ResourcePolicy>(policy));
        logger.warn("Removed  {}", policy);
    }

    @Override
    public ResourcePolicy match(final ResourceNode resourceNode) {
        String resourceType = resourceNode.getResource().getType();
        List<ResourcePolicy> candidatePolicies = findAllByType(resourceType);
        CollectionUtils.filter(candidatePolicies, new Predicate() {
            @Override
            public boolean evaluate(Object object) {
                ResourcePolicy policy = (ResourcePolicy) object;
                return policy.match(resourceNode);
            }
        });

        Collections.sort(candidatePolicies);
        if(candidatePolicies.isEmpty())
            throw new IllegalStateException("There are no policy match " + resourceNode);
        return candidatePolicies.get(0);
    }

    @Override
    public List<ResourcePolicy> findAllByType(String type) {
        List<ResourcePolicy> policies = new ArrayList<ResourcePolicy>();
        Collection<ResourcePolicy> thePolicies = this.policies.values();
        for (ResourcePolicy policy : thePolicies) {
            if(type.startsWith(policy.getResourceType())) {
                policies.add(policy);
            }
        }
        return policies;
    }

    @ManagedAttribute(description = "当前采集引擎中存储的策略数量")
    public long getSize(){
        return container.size();
    }
}
