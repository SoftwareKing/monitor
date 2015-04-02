/**
 * Developer: Kadvin Date: 14/12/22 下午3:42
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.*;
import dnt.monitor.server.exception.DiscoveryException;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.repository.NodeRepository;
import dnt.monitor.server.service.*;
import dnt.monitor.server.util.ResourceComparator;
import dnt.monitor.service.MetaService;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.event.*;
import net.happyonroad.model.*;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.type.Priority;
import net.happyonroad.type.State;
import net.happyonroad.util.DiffUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ConstraintViolation;
import javax.validation.ValidationException;
import java.io.File;
import java.util.*;

/**
 * 管理节点服务实现类
 */
@Service
@Transactional
class NodeManager extends ApplicationSupportBean
        implements NodeService, ApplicationListener<SystemStartedEvent> {

    @Autowired
    NodeRepository repository;
    @Autowired
    ServiceLocator serviceLocator;
    @Autowired
    MetaService metaService;
    @Autowired
    ServerDiscoveryService discoveryService;

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        ManagedNode root;
        try {
            root = findByPath(ManagedNode.ROOT_PATH);
        } catch (IllegalArgumentException e) {
            try {
                root = initRootNode();
                //根节点
                create(null, root);
            } catch (NodeException e2) {
                throw new ApplicationContextException("Can't auto create root node", e2);
            }
        }
        ManagedNode infNode;
        try {
            //基础架构节点
            findByPath(ManagedNode.INFRASTRUCTURE_PATH);
        } catch (IllegalArgumentException e) {
            try {
                infNode = initInfrastructureNode();
                //根节点
                create(root, infNode);
            } catch (NodeException e2) {
                throw new ApplicationContextException("Can't auto create infrastructure node", e2);
            }
        }
    }

    @Override
    public ManagedNode findByPath(String path) {
        logger.debug("Finding managed node by {}", path);
        ManagedNode node = repository.findByPath(path);
        if (node == null)
            throw new IllegalArgumentException("Can't find managed node with path = " + path);
        processNode(node, true);
        logger.debug("Found   {} by {}", node, path);
        return node;
    }

    @Override
    public List<ManagedNode> findSubNodes(ManagedNode parent, int depth, boolean leaf) {
        if (depth < 1)
            throw new IllegalArgumentException("The child nodes depth should > 0");
        logger.debug("Finding sub nodes under {} limit depth {}, with leaf {}", parent, depth, leaf);
        // depth > 0 保证了不会将父节点也查出来
        int newDepth = parent.getDepth() + depth;
        List<ManagedNode> children = repository.findAllByPath(parent.getPath(), parent.getDepth(), newDepth, leaf);
        if (children == null){
            logger.debug("Found  nothing under {} limit depth {}, with leaf {}", parent, depth, leaf);
            return Collections.emptyList();
        }
        else {
            processNodes(children);
            logger.debug("Found  {} nodes under {} limit depth {}, with leaf {}", children.size(), parent, depth, leaf);
            return children;
        }
    }

    @Override
    public void merge(ManagedNode node, ManagedNode parent) {
        if (node.getPath().equals(ManagedNode.ROOT_PATH)) {
            throw new IllegalArgumentException("You shouldn't merge root node with other");
        }
        ManagedNode another;
        if (parent == null) {
            String parentPath = Category.parentOf(node.getPath());
            another = findByPath(parentPath);
        } else {
            another = parent;
        }
        node.merge(another);
    }

    @Override
    public ManagedNode create(ManagedNode parent, ManagedNode node) throws NodeException {
        //Node的Label一定是设置的
        if (parent instanceof RangeNode) {
            boolean error = true;
            if( node instanceof ResourceNode ){
                Resource resource = ((ResourceNode) node).getResource();
                if("discovery".equalsIgnoreCase(resource.getProperty(Resource.PROPERTY_SOURCE))){
                    error = false;
                }
            }else if (node instanceof RangeNode){
                if("discovery".equalsIgnoreCase(node.getProperty(Resource.PROPERTY_SOURCE))){
                    error = false;
                }
            }
            if(error) throw new IllegalArgumentException("Can't create child under ip range node");
        }
        if (StringUtils.isBlank(node.getPath())) {
            if( parent == null ){
                node.setPath("/");
            }else{
                node.setPath(parent.getPath() + "/" + relativePathOf(node));
            }
        }
        logger.info("Creating {}", node);
        // 这个消息会有代码负责把 node 关联的resource创建出来
        publishEvent(new ObjectCreatingEvent<ManagedNode>(node));
        try {
            repository.create(node);
            if( node instanceof ResourceNode){
                repository.increaseNodeResourceSize(node.getParentPath(), 1);
            }else{
                repository.increaseNodeGroupSize(node.getParentPath(), 1);
            }
            logger.info("Created  {}", node);
        } catch (Exception e) {
            logger.warn("Failed to create " + node, e);
            publishEvent(new ObjectCreateFailureEvent<ManagedNode>(node, e));
            throw new NodeException("Can't create node", e);
        }
        publishEvent(new ObjectCreatedEvent<ManagedNode>(node));
        return node;
    }

    @Override
    public ManagedNode update(ManagedNode targetNode, ManagedNode inputNode) throws NodeException {
        //
        if (!StringUtils.equals(inputNode.getPath(), targetNode.getPath()))
            throw new NodeException("Can't change the node path, please call #updateNodesPath");
        logger.info("Updating {} to {}", targetNode, inputNode);
        publishEvent(new ObjectUpdatingEvent<ManagedNode>(targetNode, inputNode));
        ManagedNode node;
        try {
            // 原始的对象(targetNode)不变
            // 基于新的对象node进行修改
            node = applyNode(targetNode, inputNode);
            updateWithValidation(targetNode, node);
            if (logger.isInfoEnabled()) {
                String diff = DiffUtils.describeDiff(targetNode, inputNode, Record.HELP_ATTRS);
                logger.info("Updated  {} by {}", node, diff);
            }
        } catch (Exception e) {
            logger.error("Failed to update " + targetNode, e);
            publishEvent(new ObjectUpdateFailureEvent<ManagedNode>(targetNode, inputNode, e));
            throw new NodeException("Can't update node", e);
        }
        publishEvent(new ObjectUpdatedEvent<ManagedNode>(node, targetNode));
        return node;
    }

    protected ManagedNode applyNode(ManagedNode existNode, ManagedNode updating) throws NodeException {
        ManagedNode node;
        try {
            //TODO 这个逻辑未必对，应该是将input node有而target node无的属性设置过来
            node = (ManagedNode) existNode.clone();
        } catch (CloneNotSupportedException e) {
            throw new NodeException("Clone not supported by the node", e);
        }
        node.apply(updating);
        node.updating();
        return node;
    }

    protected void updateWithValidation(ManagedNode targetNode, ManagedNode updated) {
        publishEvent(new ObjectValidatingOnUpdateEvent<ManagedNode>(targetNode, updated));
        try {
            Set<ConstraintViolation<ManagedNode>> violations = validator.validate(updated);
            if (!violations.isEmpty()) {
                throw new ValidationException("There are some violations " + formatViolation(violations) + " against " + updated);
            }
            publishEvent(new ObjectValidatedOnUpdateEvent<ManagedNode>(targetNode, updated));
            repository.update(updated);
        } catch (ValidationException e) {
            publishEvent(new ObjectValidateOnUpdateFailureEvent<ManagedNode>(targetNode, updated, e));
            throw e;
        }
    }

    @Override
    public void delete(ManagedNode node) throws NodeException {
        delete(node, false);
    }
    public void delete(ManagedNode node, boolean force) throws NodeException {
        if (node instanceof ResourceNode)
            deleteWithValidation(node, force);
        else {
            List<ManagedNode> children = findSubNodes(node, 1, true);
            if (children.isEmpty())
                deleteWithValidation(node, force);
            else
                throw new UnsupportedOperationException("Can't delete node with children: "
                        + StringUtils.join(children, ","));
        }
    }

    protected void deleteWithValidation(ManagedNode node, boolean force) throws NodeException {
        node.setProperty("forceDeletion", String.valueOf(force));
        performDelete(node);
    }

    //实际执行删除动作
    protected void performDelete(ManagedNode node) throws NodeException {
        logger.warn("Deleting {}", node);
        // 这个事件会导致删除Topo节点
        publishEvent(new ObjectDestroyingEvent<ManagedNode>(node));
        try {
            repository.delete(node);
            if( node instanceof ResourceNode){
                repository.increaseNodeResourceSize(node.getParentPath(), -1);
            }else{
                repository.increaseNodeGroupSize(node.getParentPath(), -1);
            }
            logger.warn("Deleted  {}", node);
        } catch (Exception e) {
            logger.error("Failed to delete " + node, e);
            publishEvent(new ObjectDestroyFailureEvent<ManagedNode>(node, e));
            throw new NodeException("Can't delete node", e);
        }
        // 这个事件会导致删除实际资源节点
        publishEvent(new ObjectDestroyedEvent<ManagedNode>(node));

    }

    @Override
    public void deleteHierarchy(ManagedNode node) throws NodeException {
        if(org.apache.commons.lang.StringUtils.equals(node.getPath(), "/")){
            throw new IllegalArgumentException("Can't delete root node");
        }
        if (node instanceof ResourceNode)
            throw new IllegalArgumentException("Can't delete hierarchy of a leaf node: " + node.getPath());
        logger.warn("Deleting hierarchy of {}", node);
        List<ManagedNode> nodes = findSubNodes(node, 1000, true);
        sort(nodes);
        for (ManagedNode deleting : nodes) {
            deleting.hierarchyDeleting();
            delete(deleting, true);
        }
        delete(node, true);
        logger.warn("Deleted  hierarchy of {}", node);
    }

    @Override
    public ResourceNode findByResourceId(Long resourceId) {
        logger.debug("Finding node by resource id = {}", resourceId);
        ResourceNode node = (ResourceNode) repository.findByResourceId(resourceId);
        // maybe null
        processNode(node, true);
        if( node == null ){
            logger.debug("Found  nothing which resource id = {}", resourceId);
        }else{
            logger.debug("Found   {} which resource id = {}", node, resourceId);
        }
        return node;
    }

    @Override
    public RangeNode findRangeNodeBySubnet(String subnet) {
        logger.debug("Finding range node by subnet address = {}", subnet);
        RangeNode node = repository.findByRange(subnet);
        if( node != null ){
            logger.debug("Found  {} by subnet address = {}", node, subnet);
            return node;
        }else{
            logger.debug("Found  nothing by subnet address = {}", subnet);
            return null;
        }

    }

    @Override
    public MonitorEngine findEngineByResource(Resource resource) throws NodeException {
        ManagedNode resourceNode = findByResourceId(resource.getId());
        if (resourceNode == null)
            throw new UnsupportedOperationException("Can't find managed node for resource id = " + resource.getId());
        return findEngineByNode(resourceNode);
    }

    @Override
    public MonitorEngine findEngineByNode(ManagedNode node) throws NodeException {
        String nodePath = node.getPath();
        String enginePath;
        if( nodePath.startsWith(ManagedNode.INFRASTRUCTURE_PATH + "/")){
            String[] array = nodePath.split("/");// ["", "infrastructure", "$engine_scope", "..."]
            enginePath = ManagedNode.INFRASTRUCTURE_PATH + "/" + array[2] + "/engine";
        }else{
            enginePath = ManagedNode.INFRASTRUCTURE_PATH + Category.topPathOf(nodePath) + "/engine";
        }
        return findEngineByPath(enginePath);
    }

    public MonitorEngine findEngineByPath(String enginePath) throws NodeException {
        ResourceNode engineNode = (ResourceNode) findByPath(enginePath);
        try {
            EngineService engineService = (EngineService) serviceLocator.locate(engineNode.getResource());
            return engineService.findById(engineNode.getResourceId());
        } catch (ResourceException e) {
            throw new NodeException("Can't locate engine service", e);
        }
    }

    @Override
    public void updateNodesPath(String legacyPath, String newPath) throws NodeException {
        if (legacyPath.endsWith("/"))
            legacyPath = legacyPath.substring(0, legacyPath.length() - 1);
        if (newPath.endsWith("/"))
            newPath = newPath.substring(0, newPath.length() - 1);
        ManagedNode node = findByPath(legacyPath);
        ManagedNode newNode;
        try {
            newNode = (ManagedNode) node.clone();
            newNode.setPath(newPath);
        } catch (CloneNotSupportedException e) {
            throw new NodeException("Can't clone node", e);
        }
        logger.info("Updating nodes path from {} to {}", legacyPath, newPath);
        try {
            publishEvent(new ObjectUpdatingEvent<ManagedNode>(node, newNode));
            int diff = Category.depth(newPath) - Category.depth(legacyPath);
            repository.updateNodesPath(legacyPath, newPath, diff);
            int legacyGroupSize = repository.countGroupSize(legacyPath);
            int legacyResourceSize = repository.countResourceSize(legacyPath);
            repository.updateNodeChildrenSize(legacyPath, legacyGroupSize, legacyResourceSize);
            int newGroupSize = repository.countGroupSize(newPath);
            int newResourceSize = repository.countResourceSize(newPath);
            repository.updateNodeChildrenSize(newPath, newGroupSize,  newResourceSize);
            logger.info("Updated  nodes path from {} to {}", legacyPath, newPath);
        } catch (Exception e) {
            logger.info("Failed to update node path from " + legacyPath + " to " + newPath, e);
            publishEvent(new ObjectUpdateFailureEvent<ManagedNode>(node, newNode, e));
            throw new NodeException("Can't update node path", e);
        }
        publishEvent(new ObjectUpdatedEvent<ManagedNode>(newNode, node));

    }

    @Override
    public void discover(ManagedNode node) throws NodeException{
        if(node.getPath().equals(ManagedNode.ROOT_PATH)){
            throw new NodeException("The root node doesn't support discovery now");
        }
        MonitorEngine engine = findEngineByNode(node);
        if( node instanceof RangeNode){
            try {
                SubnetRange range = (SubnetRange) ((RangeNode) node).getRange();
                discoveryService.discoveryRange(engine, range, 1);
            } catch (DiscoveryException e) {
                throw new NodeException("Failed to discover " + node + " by " + engine, e);
            }
        }else if (node instanceof ResourceNode){
            logger.info("Discovering the resource node {}", node);
        }else {
            GroupNode groupNode = (GroupNode) node;
            List<ManagedNode> children = findSubNodes(groupNode, 1, true);
            for(ManagedNode childNode : children ){
                discover(childNode);
            }
        }

    }

    ////////////////////////////////////////
    // 内部支持方法
    ////////////////////////////////////////

    ManagedNode initRootNode() {
        GroupNode root = new GroupNode();
        root.setPath(ManagedNode.ROOT_PATH);
        root.setLabel("监控系统");
        root.setIcon("monitor_system");
        root.setComment("The system root node");
        //所有节点，默认由snmp的监控方式
        List<Credential> credentials = new ArrayList<Credential>(2);
        credentials.add(new SnmpCredential());
        //ssh尝试设计默认的私钥认证模式
        //默认的监控用户名称为通过系统属性设置，不设置则为root
        String monitorUser = System.getProperty("default.monitor.user", "root");
        File permFile = new File(System.getProperty("user.home"), ".ssh/id_rsa");
        if( permFile.exists() ){
            credentials.add(new SshCredential(monitorUser, permFile));
        }else{
            permFile = new File(System.getProperty("user.home"), ".ssh/id_dsa");
            if(permFile.exists())
                credentials.add(new SshCredential(monitorUser, permFile));
        }

        root.setCredentials(credentials.toArray(new Credential[credentials.size()]));
        return root;
    }

    private ManagedNode initInfrastructureNode() {
        GroupNode node = new GroupNode();
        node.setPath(ManagedNode.INFRASTRUCTURE_PATH);
        node.setLabel("基础架构");
        node.setIcon("monitor_system");
        node.setComment("The system infrastructure");
        node.setState(State.Running);
        node.setPriority(Priority.Normal);
        //基础架构下面的东西，默认采用本机监控方式
        Credential[] credentials = new Credential[1];
        credentials[0] = new LocalCredential();
        node.setCredentials(credentials);
        return node;
    }

    String relativePathOf(ManagedNode node) {
        //如果节点设置了相对路径（类似于用户设置了alias)，则直接返回该属性
        if (node.getProperty(Resource.PROPERTY_RELATIVE_PATH) != null)
            return node.getProperty(Resource.PROPERTY_RELATIVE_PATH);
        if (node instanceof RangeNode) {
            //动态组，取range
            IpRange range = ((RangeNode) node).getRange();
            return Resource.convertAsPath(range.toString());
        } else if (node instanceof GroupNode) {
            //静态组，取name
            // 在手工创建静态组时，用户必须为其指定一个不可变更的名称
            // 而系统基于引擎对象自动创建的静态组，也应该由系统程序保证有一个可放到param里面的英文名称
            return node.getProperty("name");
        } else {
            //资源对象: TODO 应该基于资源对象的类型，反射方法获取
            Resource resource = ((ResourceNode)node).getResource();
            if (StringUtils.isNotBlank(resource.getAddress())) {
                return Resource.convertAsPath(resource.getAddress());
            } else if (StringUtils.isNotBlank(resource.getLabel())) {
                return Resource.convertAsPath(resource.getLabel());
            } else
                throw new UnsupportedOperationException("Can't generate relative path for " + node);
        }
    }

    void sort(List<ManagedNode> nodes) {
        //先按照深度排列，最浅的放在最后面
        // 而后比较类型，如果是监控引擎，则应该放在最后面
        ResourceComparator depthComparator = new ResourceComparator();
        Collections.sort(nodes, depthComparator);
        //System.out.println(nodes);
    }

    // 该方法是在Mybatis不能有效的多态映射前提下，自行进行类型转换的处理逻辑
    // 以后解决了 mybatis 的问题之后，应该不需要这些逻辑
    protected void processNode(ManagedNode node, boolean retrieve) {
        if (node == null) return;
        if (!(node instanceof ResourceNode )) return;
        ResourceNode resourceNode = (ResourceNode) node;
        Resource resource = resourceNode.getResource();
        MetaResource metaResource = metaService.getMetaResource(resource.getType());
        Resource actual;
        if( ! retrieve ){
            actual = resource.becomes(metaResource.getModelClass());
        }else{
            try {
                ResourceService concreteResourceService = serviceLocator.locateResourceService(resource.getType());
                actual = concreteResourceService.findById(resource.getId());
            } catch (ResourceException e) {
                logger.warn("Can't find concrete resource service for " + resource.getType());
                actual = resource.becomes(metaResource.getModelClass());
            }
        }
        resourceNode.setResource(actual);
    }

    protected void processNodes(List<ManagedNode> nodes) {
        for (ManagedNode node : nodes) {
            //这句话中， 第二个参数设为true之后，将会把查询批量节点的逻辑，需要为其中的资源节点都 额外find One下
            //如果在 mybatis 层面没有更好的解决方案，那么就需要这么做
            //TODO 可以简化的是， ResourceNode就不需要resource对象，查询SQL里面也不需要join了
            processNode(node, true);
        }
    }


}
