package dnt.monitor.server.support;

import dnt.monitor.exception.PolicyException;
import dnt.monitor.meta.*;
import dnt.monitor.policy.ComponentPolicy;
import dnt.monitor.policy.ConfigPolicy;
import dnt.monitor.policy.MetricPolicy;
import dnt.monitor.policy.ResourcePolicy;
import dnt.monitor.server.exception.RecordNotFoundException;
import dnt.monitor.server.repository.PolicyRepository;
import dnt.monitor.server.service.PolicyService;
import dnt.monitor.service.MetaService;
import net.happyonroad.event.*;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.type.Priority;
import net.happyonroad.type.State;
import net.happyonroad.util.DiffUtils;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * <h1>策略服务实现</h1>
 *
 * @author Jay Xiong
 */
@SuppressWarnings("unchecked")
@Service
@ManagedResource(objectName = "dnt.monitor.server:type=service,name=policyService")
public class PolicyManager extends ApplicationSupportBean
        implements PolicyService, ApplicationListener<SystemStartedEvent> {
    @Autowired
    PolicyRepository repository;
    @Autowired
    MetaService metaService;

    public PolicyManager() {
        //放在Service Manager(100)后面执行
        setOrder(200);
    }

    @Override
    public List<ResourcePolicy> findAll() {
        return repository.findAll();
    }

    @Override
    public List<ResourcePolicy> findAllByResourceType(String resourceType) {
        return repository.findAllByResourceType(resourceType);
    }

    @Override
    public ResourcePolicy findById(Long id) {
        ResourcePolicy policy = repository.findById(id);
        if (policy == null)
            throw new RecordNotFoundException("Can't find resource policy with id = " + id);
        return policy;
    }

    @Override
    public void create(ResourcePolicy policy) throws PolicyException {
        logger.info("Creating {}", policy);
        publishEvent(new ObjectCreatingEvent<ResourcePolicy>(policy));
        try {
            repository.create(policy);
            if (policy.getComponents() != null) for (ComponentPolicy componentPolicy : policy.getComponents()) {
                componentPolicy.setResourcePolicyId(policy.getId());
                repository.createComponentPolicy(componentPolicy);
            }
        } catch (Exception e) {
            publishEvent(new ObjectCreateFailureEvent<ResourcePolicy>(policy, e));
            throw new PolicyException(e);
        }
        publishEvent(new ObjectCreatedEvent<ResourcePolicy>(policy));
        logger.info("Created  {}", policy);
    }

    @Override
    public void update(ResourcePolicy legacy, ResourcePolicy policy) throws PolicyException {
        logger.info("Updating {}", policy);
        publishEvent(new ObjectUpdatingEvent<ResourcePolicy>(legacy, policy));
        try {
            repository.update(policy);
            Map<Integer, List<ComponentPolicy>> results = DiffUtils.diff(legacy.getComponents(), policy.getComponents(), "id");
            List<ComponentPolicy> updatings = results.get(0);
            List<ComponentPolicy> creatings = results.get(1);
            List<ComponentPolicy> deletings = results.get(-1);
            for (ComponentPolicy updating: updatings) {
                repository.updateComponentPolicy(updating);
            }
            for (ComponentPolicy creating : creatings) {
                creating.setResourcePolicyId(policy.getId());
                repository.createComponentPolicy(creating);
            }
            for (ComponentPolicy deleting : deletings) {
                repository.deleteComponentPolicy(deleting);
            }
        } catch (Exception e) {
            publishEvent(new ObjectUpdateFailureEvent<ResourcePolicy>(legacy, policy, e));
            throw new PolicyException(e);
        }
        publishEvent(new ObjectUpdatedEvent<ResourcePolicy>(policy, legacy));
        logger.info("Updated  {}", policy);
    }

    @Override
    public void deleteById(@Param("id") Long id) throws PolicyException {
        ResourcePolicy policy = findById(id);
        logger.warn("Deleting {}", policy);
        publishEvent(new ObjectDestroyingEvent<ResourcePolicy>(policy));
        try {
            repository.create(policy);
            if (policy.getComponents() != null) for (ComponentPolicy componentPolicy : policy.getComponents()) {
                repository.deleteComponentPolicy(componentPolicy);
            }
        } catch (Exception e) {
            publishEvent(new ObjectDestroyFailureEvent<ResourcePolicy>(policy, e));
            throw new PolicyException(e);
        }
        publishEvent(new ObjectDestroyedEvent<ResourcePolicy>(policy));
        logger.warn("Deleted  {}", policy);
    }


    @ManagedAttribute
    public int getPolicySize(){
        return repository.count();
    }

    //系统启动之后，同步元模型与缺省策略
    // 也就是，将资源元模型转换为缺省策略

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        List<MetaResource> metaResources = metaService.getMetaResources();
        for (MetaResource metaResource : metaResources) {
            syncDefaultPolicy(metaResource);
        }
    }

    private void syncDefaultPolicy(MetaResource metaResource) {
        String type = metaResource.getType();
        List<ResourcePolicy> policies = repository.findAllByResourceType(type);
        if( policies.isEmpty() ){
            ResourcePolicy policy = convert(metaResource);
            try {
                create(policy);
            } catch (PolicyException e) {
                logger.error("Can't save auto-converted policy {}", policy);
            }
        }
    }

    private ResourcePolicy convert(MetaResource metaResource) {
        ResourcePolicy policy = new ResourcePolicy();
        policy.setLabel( metaResource.getLabel() + "缺省策略");
        policy.setEnabled(true);
        policy.setPriority(Priority.Normal);
        policy.setResourceType(metaResource.getType());
        policy.creating();

        List<MetaRelation> components = metaResource.getComponents();
        ComponentPolicy[] componentPolicies = new ComponentPolicy[components.size()];
        for (int i = 0; i < components.size(); i++) {
            MetaRelation metaRelation = components.get(i);
            componentPolicies[i] = convert(metaRelation);
        }
        policy.setComponents(componentPolicies);
        List<MetaMetric> metrics = metaResource.getMetrics();
        policy.setMetrics(convertMetrics(metrics));
        List<MetaConfig> configs = metaResource.getConfigs();
        policy.setConfigs(convertConfigs(configs));

        //policy.setAlarms(...);
        //policy.setNotifications(...);
        //policy.setActions(...);
        return policy;
    }

    private ComponentPolicy convert(MetaRelation componentRelation) {
        MetaComponent metaComponent = (MetaComponent) componentRelation.getMetaModel();
        ComponentPolicy policy = new ComponentPolicy();
        policy.setFieldName(componentRelation.getName());
        //policy.setFrequency(); //default null, as resource defined?
        policy.setKeyed(metaComponent.getKeyed() != null);
        policy.setState(State.Running);
        policy.creating();
        List<MetaMetric> metrics = metaComponent.getMetrics();
        policy.setMetrics(convertMetrics(metrics));
        List<MetaConfig> configs = metaComponent.getConfigs();
        policy.setConfigs(convertConfigs(configs));
        return policy;
    }

    private MetricPolicy[] convertMetrics(List<MetaMetric> metaMetrics) {
        MetricPolicy[] policies = new MetricPolicy[metaMetrics.size()];
        for (int i = 0; i < metaMetrics.size(); i++) {
            MetaMetric metaMetric = metaMetrics.get(i);
            policies[i] = convert(metaMetric);
        }
        return policies;
    }

    private ConfigPolicy[] convertConfigs(List<MetaConfig> metaConfigs) {
        ConfigPolicy[] policies = new ConfigPolicy[metaConfigs.size()];
        for (int i = 0; i < metaConfigs.size(); i++) {
            MetaConfig metaConfig = metaConfigs.get(i);
            policies[i] = convert(metaConfig);
        }
        return policies;
    }

    private MetricPolicy convert(MetaMetric metaMetric) {
        MetricPolicy policy = new MetricPolicy();
        policy.setFieldName(metaMetric.getName());
        policy.setUnit(metaMetric.getUnit());
        policy.setCritical(metaMetric.getCritical());
        policy.setWarning(metaMetric.getWarning());
        policy.setOccurrences(metaMetric.getOccurrences());
        policy.setKeyed(metaMetric.getKeyed() != null );
        return policy;
    }

    private ConfigPolicy convert(MetaConfig metaConfig) {
        ConfigPolicy policy = new ConfigPolicy();
        policy.setFieldName(metaConfig.getName());
        policy.setKeyed(metaConfig.getKeyed() != null );
        policy.setUnit(metaConfig.getUnit());
        return policy;
    }
}
