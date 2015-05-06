package dnt.monitor.engine.support;

import dnt.monitor.engine.model.MonitoringTask;
import dnt.monitor.engine.service.MonitoringTaskStore;
import dnt.monitor.engine.service.NodeStore;
import dnt.monitor.engine.service.PolicyStore;
import dnt.monitor.engine.service.ResourceStore;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;
import net.happyonroad.cache.CacheService;
import net.happyonroad.cache.MapContainer;
import net.happyonroad.event.*;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import java.util.*;

import static net.happyonroad.support.BinarySupport.parseBinary;
import static net.happyonroad.support.BinarySupport.toBinary;

/**
 * <h1>资源监控任务管理器</h1>
 * <p/>
 * 该对象将会发出事件，外部应该根据相应的事件执行监控任务，以及记录监控日志
 *
 * @author Jay Xiong
 */
@Component
@ManagedResource("dnt.monitor.engine:type=store,name=taskStore")
public class DefaultMonitoringTaskStore extends ApplicationSupportBean
        implements MonitoringTaskStore, ApplicationListener<SystemStartedEvent> {
    @Autowired
    CacheService  cacheService;
    @Autowired
    ResourceStore resourceStore;
    @Autowired
    NodeStore     nodeStore;
    @Autowired
    PolicyStore   policyStore;

    // node path -> task
    MapContainer container;
    Map<String, MonitoringTask> tasks = new HashMap<String, MonitoringTask>();

    public DefaultMonitoringTaskStore() {
        setOrder(110);//after default resource store(100) started
    }

    @Override
    public Collection<MonitoringTask> getTasks() {
        return tasks.values();
    }

    public List<MonitoringTask> loadTasks() {
        List<MonitoringTask> taskList = new LinkedList<MonitoringTask>();
        for (String path : container.keys()) {
            byte[] bytes = container.getBinary(path);
            if (bytes != null) {
                logger.info("Loading ResourceMonitoringTask({})", path);
                MonitoringTask task = parseBinary(bytes, MonitoringTask.class);
                ResourceNode node = (ResourceNode) nodeStore.findByPath(path);
                Resource resource = resourceStore.findById(node.getResourceId());
                node.setResource(resource);
                task.updateNode(node);
                ResourcePolicy policy = policyStore.findById(task.getPolicyId());
                task.updatePolicy(policy);
                this.tasks.put(node.getPath(), task);
                logger.info("Loaded  {}", task);
                taskList.add(task);
            }
        }
        return taskList;
    }

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        loadTasks();
    }

    @Override
    protected void performStart() {
        super.performStart();
        container = cacheService.getMapContainer(getClass().getSimpleName());
        tasks = new HashMap<String, MonitoringTask>();
    }

    @Override
    public MonitoringTask findTask(String nodePath) {
        return tasks.get(nodePath);
    }

    @Override
    public List<MonitoringTask> findTasks(String path) {
        List<MonitoringTask> results = new LinkedList<MonitoringTask>();
        for (MonitoringTask task : tasks.values()) {
            if (task.getPath().startsWith(path)) results.add(task);
        }
        return results;
    }

    @Override
    public List<MonitoringTask> findTasksByResourceType(String resourceType) {
        List<MonitoringTask> results = new LinkedList<MonitoringTask>();
        for (MonitoringTask task : tasks.values()) {
            if (task.getResourceType().startsWith(resourceType)) results.add(task);
        }
        return results;
    }

    @Override
    public void createTask(ResourceNode node, ResourcePolicy policy) {
        MonitoringTask legacy = findTask(node.getPath());
        if (legacy != null)
            throw new IllegalArgumentException("Create duplicate task for path " + node.getPath());

        MonitoringTask task = new MonitoringTask(node, policy);
        logger.info("Creating {}", task);
        publishEvent(new ObjectCreatingEvent<MonitoringTask>(task));
        tasks.put(node.getPath(), task);
        container.put(node.getPath(), toBinary(task));
        logger.info("Created  {}", task);
        publishEvent(new ObjectCreatedEvent<MonitoringTask>(task));
    }

    @Override
    public void removeTask(String nodePath) {
        MonitoringTask task = findTask(nodePath);
        if (task == null) return;
        publishEvent(new ObjectDestroyingEvent<MonitoringTask>(task));
        tasks.remove(nodePath);
        container.remove(nodePath);
        publishEvent(new ObjectDestroyedEvent<MonitoringTask>(task));
    }

    @Override
    public void updateTask(String nodePath, ResourceNode newNode) {
        MonitoringTask task = findTask(nodePath);
        if (task == null) {
            logger.warn("Can't update task at path " + nodePath + ", because it doesn't exist");
            return;
        }
        //先构建一个helper对象，其代表这个任务将会变成的样子
        MonitoringTask helper = new MonitoringTask(newNode, task.getPolicy());
        publishEvent(new ObjectUpdatingEvent<MonitoringTask>(task, helper));
        ResourceNode oldNode = task.getNode();
        if(!StringUtils.equals(nodePath, newNode.getPath())){
            tasks.remove(nodePath);
            container.remove(nodePath);
        }
        task.updateNode(newNode);
        tasks.put(newNode.getPath(), task);
        container.put(newNode.getPath(), toBinary(task));
        //再将该对象的node改为原纪录，其代表这个任务原来的样子
        helper.updateNode(oldNode);
        publishEvent(new ObjectUpdatedEvent<MonitoringTask>(task, helper));
    }

    @Override
    public void updateTask(String nodePath, ResourcePolicy policy) {
        MonitoringTask task = findTask(nodePath);
        if (task == null) {
            logger.warn("Can't update task at path " + nodePath + ", because it doesn't exist");
            return;
        }
        //先构建一个helper对象，其代表这个任务将会变成的样子
        MonitoringTask helper = new MonitoringTask(task.getNode(), policy);
        publishEvent(new ObjectUpdatingEvent<MonitoringTask>(helper, task));
        ResourcePolicy oldPolicy = task.getPolicy();
        task.updatePolicy(policy);
        //再将该对象的policy改为原纪录，其代表这个任务原来的样子
        helper.updatePolicy(oldPolicy);
        publishEvent(new ObjectUpdatedEvent<MonitoringTask>(task, helper));
    }


    @ManagedAttribute(description = "当前采集引擎中存储的资源数量")
    public long getSize(){
        return container.size();
    }

}
