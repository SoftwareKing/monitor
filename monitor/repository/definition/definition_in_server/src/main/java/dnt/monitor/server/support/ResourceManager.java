/**
 * Developer: Kadvin Date: 14/12/26 上午10:45
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.server.exception.RecordNotFoundException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Component;
import dnt.monitor.model.Link;
import dnt.monitor.model.Resource;
import dnt.monitor.server.repository.ResourceRepository;
import dnt.monitor.server.service.LinkService;
import dnt.monitor.server.service.ResourceService;
import dnt.monitor.service.MetaService;
import net.happyonroad.event.*;
import net.happyonroad.model.Record;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;
import net.happyonroad.platform.util.DefaultPage;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.DiffUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContextException;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;

import javax.validation.ConstraintViolation;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * <h1>基本/通用资源服务的实现类</h1>
 * 它有两个作用：
 * <ol>
 * <li>作为基本的Resource管理对象
 * <li>可以被子Resource的管理类继承(由于被标记为package visible，所以子类必须在同一个包下)
 * </ol>
 */
@SuppressWarnings("unchecked")
@Service
//Transactional 会和 mbean机制冲突，因为 mbean exporter届时看到的不是这个类，而是proxy类
//我们暂时也不在服务层增加事务，而是仅在控制器层在增加
//@Transactional
@ManagedResource(objectName = "dnt.monitor.server:type=extension,name=resourceService")
//如果把 这个 类标记为 package visible，则jmx将会无法获取未在接口上暴露的jmx属性
public class ResourceManager<R extends Resource> extends ApplicationSupportBean
        implements ResourceService<R> {

    ResourceRepository<R> repository;
    @Autowired
    MetaService metaService;
    @Autowired
    LinkService linkService;

    //TODO 在正常的组件运行环境中，多个组件是隔离的，manager类可以不通过qualifier引用到Repository
    // 但考虑在测试等情况下，会将多个Repository混杂在一起，所以普遍Manager类对相应的Repository的引用增加Qualifier
    @Autowired
    public ResourceManager(@Qualifier("resourceRepository") ResourceRepository<R> repository) {
        this.repository = repository;
    }

    @Override
    public Class<? extends Resource> getResourceType() {
        return Resource.class;
    }

    protected ResourceRepository<R> getRepository() {
        return repository;
    }

    @Override
    public Page<R> paginateByType(String type, Pageable request) {
        if (!type.startsWith("/")) type = "/" + type;
        long count = repository.countByType(type);
        if (count > 0) {
            List<R> data = repository.findAllByType(type, request);
            processList(data);
            return new DefaultPage<R>(data, request, count);
        } else {
            return new DefaultPage<R>(new ArrayList<R>(), request, 0);
        }
    }

    @Override
    public R findById(Long id) {
        R resource = repository.findById(id);
        if (resource == null)
            throw new RecordNotFoundException("Can't find resource with id = " + id);
        resource = processRecord(resource);
        assemble(resource);
        return resource;
    }

    @Override
    public R findByAddress(String address) {
        R resource = repository.findByAddress(address);
        if( resource == null ) return null;
        resource = processRecord(resource);
        assemble(resource);
        return resource;
    }

    @Override
    public R findByLabel(String label) {
        R resource = repository.findByLabel(label);
        if( resource == null ) return null;
        resource = processRecord(resource);
        assemble(resource);
        return resource;
    }

    /**
     * <h2>将资源和相关的组件的实例关系组装好</h2>
     * @param resource 查询出来的资源实例，可能包括其组件实例，但component#resource可能还是null
     */
    protected void assemble(R resource) {

    }

    /**
     * <h2>设置组件的resource为相应的资源对象</h2>
     * @param resource 资源
     * @param component 组件
     */
    protected void associate(R resource, Component component) {
        component.setResource(resource);
    }

    /**
     * <h2>创建资源</h2>
     * 提供创建资源的框架式代码，包括了事务控制和事件机制
     *
     * @param resource 被创建的资源
     * @throws ResourceException 异常
     */
    @Override
    public final R create(R resource) throws ResourceException {
        logger.info("Creating {}", resource);
        publishEvent(new ObjectCreatingEvent<R>(resource));
        try {
            createWithValidation(resource);
        } catch (ResourceException e) {
            logger.error("Failed to create " + resource, e);
            publishEvent(new ObjectCreateFailureEvent<R>(resource, e));
            throw e;
        }
        publishEvent(new ObjectCreatedEvent<R>(resource));
        logger.info("Created  {}", resource);
        return resource;
    }

    protected final void createWithValidation(R resource) throws ResourceException {
        try {
            validateOnCreate(resource);
            publishEvent(new ObjectValidatedOnCreateEvent<R>(resource));
        } catch (ValidationException e) {
            publishEvent(new ObjectValidateOnCreateFailureEvent<R>(resource, e));
            throw e;
        }
        performCreate(resource);
    }

    /**
     * <h2>执行实际的创建动作，子类可以继承</h2>
     *
     * @param resource 被创建的资源
     * @throws ResourceException 异常
     */
    protected void performCreate(R resource) throws ResourceException {
        resource.creating();
        repository.create(resource);
        cascadeCreate(resource);
    }

    /**
     * <h2>级联创建Resource下面的组件</h2>
     *
     * @param resource 刚刚被创建的资源
     */
    protected void cascadeCreate(R resource){
        logger.trace("Does nothing for cascade create components of {}", resource);
    }

    /**
     * <h2>更新资源</h2>
     * 提供更新资源的框架式代码，包括了事务控制和事件机制
     *
     * @param legacy   现有的资源
     * @param updating 更新的资源信息
     * @throws ResourceException 异常
     */
    @Override
    public final R update(R legacy, R updating) throws ResourceException {
        logger.info("Updating {} to {}", legacy, updating);
        publishEvent(new ObjectUpdatingEvent<R>(legacy, updating));
        R resource;
        try {
            resource = applyBean(legacy, updating);
            updateWithValidation(legacy, resource);
        } catch (ResourceException e) {
            logger.error("Failed to update " + legacy + " to " + updating, e);
            publishEvent(new ObjectUpdateFailureEvent<R>(legacy, updating, e));
            throw e;
        }
        publishEvent(new ObjectUpdatedEvent<R>(resource, legacy));
        if (logger.isInfoEnabled()) {
            String differences = DiffUtils.describeDiff(legacy, updating, Record.HELP_ATTRS);
            logger.info("Updated  {} by {}", updating, StringUtils.abbreviate(differences, 100 ));
        }
        return resource;
    }

    @Override
    public R update(R updating) throws ResourceException {
        R legacy = findById(updating.getId());
        return update(legacy, updating);
    }

    protected final void updateWithValidation(R legacy, R resource) throws ResourceException {
        publishEvent(new ObjectValidatingOnUpdateEvent<R>(legacy, resource));
        try {
            validateOnUpdate(legacy, resource);
            publishEvent(new ObjectValidatedOnUpdateEvent<R>(legacy, resource));
            performUpdate(legacy, resource);
        } catch (ValidationException e) {
            publishEvent(new ObjectValidateOnUpdateFailureEvent<R>(legacy, resource, e));
            throw e;
        }
    }

    /**
     * 执行实际的更新动作，子类可以继承
     *
     * @param legacy   原有的资源,这个类不能定义为 R，因为类型可能变化，其可能是R的父类变过来的
     * @param updating 被更新的资源
     */
    protected void performUpdate(Resource legacy, R updating) {
        repository.update(updating);
    }

    /**
     * 将一个新的bean属性设置到数据库已有的bean对象上
     *
     * @param legacy   数据库已有对象
     * @param updating 拥有更新属性的对象
     * @return 属性合并之后的对象
     * @throws ResourceException
     */
    protected R applyBean(R legacy, R updating) throws ResourceException {
        R resource;
        try {
            //之所以要克隆，是为了后面发出的更新事件中的原对象属性没有被修改
            //方便事件监听者判断
            //Rails active model有dirty/changed机制，但我们的对象没有
            //所以采用这个clone的方式，但这个方式对于对象引用时存在问题
            // 不过，我们的资源更新，暂时仅意味着更新该资源自身，其所属组件的更新问题暂时未考虑
            resource = (R) updating.clone();
            resource.apply(legacy);
        } catch (CloneNotSupportedException e) {
            throw new ResourceException("Can't clone " + legacy, e);
        }
        resource.apply(updating, "id");
        resource.updating();
        return resource;
    }

    /**
     * <h2>执行对对象的验证操作</h2>
     *
     * @param resource 被校验的资源
     * @throws ValidationException 校验异常
     */
    protected void validateOnCreate(R resource) throws ValidationException {
        Set<ConstraintViolation<R>> violations = validator.validate(resource);
        if (!violations.isEmpty()) {
            throw new ValidationException("There are some violations " + formatViolation(violations) + " against " + resource);
        }
    }

    /**
     * <h2>执行对对象的验证操作</h2>
     *
     * @param exist    原来的资源，作为参考
     * @param resource 被校验的资源，其属性已经是需要update的对象和已有对象合并之后的结果了
     * @throws ValidationException 校验异常
     */
    protected void validateOnUpdate(R exist, R resource) throws ValidationException {
        Set<ConstraintViolation<R>> violations = validator.validate(resource);
        if (!violations.isEmpty()) {
            throw new ValidationException("There are some violations " + formatViolation(violations) + " against " + resource);
        }
    }

    /**
     * <h2>执行对对象的验证操作</h2>
     * 默认的验证逻辑为：拒绝删除任何还存在Link的资源，要求使用者必须先删除Link，才能删除资源
     *
     * @param resource 被校验的资源
     * @throws ValidationException 校验异常
     */
    protected void validateOnDelete(R resource) throws ValidationException {
        // do nothing
        List<Link> links = linkService.finkLinksFrom(resource);
        if( !links.isEmpty() ){
            throw new ApplicationContextException("Can't destroy " + resource +
                                                  ", because of there are links from it: " + links);
        }
        links = linkService.finkLinksTo(resource);
        if( !links.isEmpty() ){
            throw new ApplicationContextException("Can't destroy " + resource +
                                                  ", because of there are links to it: " + links);
        }
    }

    /**
     * <h2>删除资源</h2>
     * 提供删除资源的框架式代码，包括了事务控制和事件机制
     *
     * @param resource 被删除的资源
     * @throws ResourceException 异常
     */
    @Override
    public final void delete(R resource) throws ResourceException {
        logger.warn("Deleting {}", resource);
        // 在数据库层面
        //   资源到其组成对象 t_hosts, t_xxx 的删除关系是级联删除
        //   资源到其Link的关系也是级联删除
        //   资源到其子组件的关系也是级联删除
        // 所以，只需要执行 delete resource，其他对象都会被一并删除
        //   由于这些删除动作是在数据库层面进行的，所以，子组件，Link都不会有相应的删除事件发生
        // 用了一个Destroying Handler: AntiDestroyingForLegacyLinks，拒绝删除存在Link的资源
        //       而不是借数据库的cascade deleting 机制
        // 但是
        //   Managed Node -> Resource之间不是级联删除
        //     这部分机制是通过 显性的控制逻辑(参考 NodeManager 的实现代码)完成
        //     不应该存在 Resource -> Managed Node 的级联删除通道
        //   Resource -> TopoNode之间也不是级联删除
        //     这部分机制是通过 在删除资源之前发出对象事件，由 TopoManager 监听到之后执行Topo Node的删除动作
        //     TopoLink不会听到Link的删除事件，也不应该基于此地发出的Node删除事件，而是基于其相连的Topo Node的删除事件
        //
        publishEvent(new ObjectDestroyingEvent<R>(resource));
        try {
            validateOnDelete(resource);
            performDelete(resource);
        } catch (Exception e) {
            logger.error("Failed to delete " + resource, e);
            publishEvent(new ObjectDestroyFailureEvent<R>(resource, e));
            throw new ResourceException("Can't delete the " + resource, e);
        }
        publishEvent(new ObjectDestroyedEvent<R>(resource));
        logger.warn("Deleted  {}", resource);
    }

    /**
     * 执行实际的删除动作，子类可以继承
     *
     * @param resource 被删除的资源
     * @throws ResourceException 异常
     */
    protected void performDelete(R resource) throws ResourceException {
        repository.deleteById(resource.getId());
    }

    ////////////////////////////////////////
    // JMX 可管理接口
    ////////////////////////////////////////


    @ManagedAttribute
    public long getSize(){
        Class<? extends Resource> resourceType = getResourceType();
        MetaResource metaResource = metaService.getMetaResource(resourceType);
        return repository.countByType(metaResource.getType());
    }

    // 该方法是在Mybatis不能有效的多态映射前提下，自行进行类型转换的处理逻辑
    // 以后解决了 mybatis 的问题之后，应该不需要这些逻辑
    protected R processRecord(R resource) {
        if( resource == null ) return null;
        MetaResource metaResource = metaService.getMetaResource(resource.getType());
        Class klass = metaResource.getModelClass();
        resource = (R) resource.becomes(klass);
        return resource;
    }

    protected void processList(List<R> data) {
        for (int i = 0; i < data.size(); i++) {
            R r = data.get(i);
            data.set(i, processRecord(r));
        }

    }

}
