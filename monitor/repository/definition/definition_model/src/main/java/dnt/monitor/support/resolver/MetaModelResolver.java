/**
 * Developer: Kadvin Date: 15/2/5 下午4:03
 */
package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.snmp.Group;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaMember;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.snmp.MetaGroup;
import dnt.monitor.meta.snmp.MetaTable;
import dnt.monitor.meta.ssh.MetaCommand;
import dnt.monitor.meta.ssh.MetaMapping;
import dnt.monitor.model.Entry;
import dnt.monitor.model.ManagedObject;
import dnt.monitor.service.MetaResolver;
import net.happyonroad.util.StringUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.reflect.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.AnnotationUtils;

import java.beans.PropertyDescriptor;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import static org.apache.commons.lang.StringUtils.capitalize;

/**
 * <h1>抽象的Meta Model Resolver</h1>
 */
@SuppressWarnings("unchecked")
public abstract class MetaModelResolver<T, M extends MetaModel<T>> extends MetaObjectResolver
        implements MetaResolver<T, M> {

    @Autowired
    MetaRelationResolver relationResolver ;
    @Autowired
    MetaIndicatorResolver indicatorResolver;
    @Autowired
    MetaMetricResolver metricResolver;
    @Autowired
    MetaConfigResolver configResolver;

    abstract M createMetaModel(Class<T> klass) throws MetaException;

    @Override
    public M resolve(Class<T> klass) throws MetaException {
        M metaModel = createMetaModel(klass);

        resolveSnmp(klass, metaModel);
        resolveSsh(klass, metaModel);

        applyDefaults(metaModel);

        metaService.register(metaModel);
        try {
            processMembers(klass, metaModel);
            return metaModel;
        } catch (MetaException e) {
            metaService.unregister(metaModel);
            throw e;
        }
    }

    /**
     * <h2>根据 配置的 messages 里面的内容，为元模型设置基本属性</h2>
     * 仅在原来模型对象没有设置该属性时进行设置，包括:
     * <ol>
     * <li>name: $(class.simpleName)
     * <li>label: $(class.simpleName).label
     * <li>description: $(class.simpleName).description
     * </ol>
     *
     * @param metaModel 需要配置的元模型
     */
    protected void applyDefaults(M metaModel) {
        String className = reduceCglibName(metaModel.getModelClass().getSimpleName());
        if (StringUtils.isBlank(metaModel.getName())) {
            metaModel.setName(className);
        }
        if (StringUtils.isBlank(metaModel.getLabel())) {
            String label = message(metaModel.getModelClass(), ".label", capitalize(className));
            metaModel.setLabel(label);
        }
        if (StringUtils.isBlank(metaModel.getDescription())) {
            String description = message(metaModel.getModelClass(), ".description");
            if (StringUtils.isNotBlank(description)) metaModel.setDescription(description);
        }
    }

    protected void inherit(MetaModel childMeta, MetaModel parentMeta) {
        if (parentMeta.getProperties() != null) {
            Properties inherited = new Properties();
            inherited.putAll(parentMeta.getProperties());
            childMeta.setProperties(inherited);
        }
        if (parentMeta.getMembers() != null)
            for (MetaMember member : (List<MetaMember>) parentMeta.getMembers()) {
                childMeta.register(member);
            }
    }

    protected void resolveSnmp(Class klass, MetaModel metaModel) {
        //snmp的annotation不继承
        Group group = AnnotationUtils.findAnnotation(klass, Group.class);
        if (group != null) {
            MetaGroup metaGroup = resolveSnmpGroup(group);
            metaModel.setSnmpGroup(metaGroup);
        }
        Table table = AnnotationUtils.findAnnotation(klass, Table.class);
        if (table != null) {
            MetaTable metaTable = resolveSnmpTable(table);
            metaModel.setSnmpTable(metaTable);
        }
    }

    protected void resolveSsh(Class klass, MetaModel metaModel) {
        //ssh的annotation要继承
        Class processing = klass;
        List<MetaCommand> commands = new ArrayList<MetaCommand>(3);
        List<MetaMapping> mappings = new ArrayList<MetaMapping>(3);
        while(processing != ManagedObject.class && processing != null){
            Command command = (Command) processing.getAnnotation(Command.class);
            Mapping mapping = (Mapping) processing.getAnnotation(Mapping.class);
            if( command != null || mapping != null ){
                if( command != null ){
                    MetaCommand metaCommand = resolveSshCommand(command);
                    commands.add(metaCommand);
                }
                if( mapping != null ){
                    MetaMapping metaMapping = resolveSshMapping(mapping);
                    mappings.add(metaMapping);
                }
            }
            processing = processing.getSuperclass();
        }
        Collections.reverse(commands);
        Collections.reverse(mappings);
        metaModel.setCommands(commands);
        metaModel.setMappings(mappings);
    }

    /**
     * 从某个ManagedObject类中解析所有的元属性
     *
     * @param klass     对象类型
     * @param metaModel 已经解析出来的对象的元模型
     */
    protected void processMembers(Class<T> klass, M metaModel) throws MetaException {
        PropertyDescriptor[] descriptors = PropertyUtils.getPropertyDescriptors(klass);
        for (PropertyDescriptor descriptor : descriptors) {
            MetaMember metaMember;
            //没有对应类型的描述，肯定不合法，过滤之
            if (descriptor.getPropertyType() == null) continue;
            //不可写的字段，一般不是指标/属性，过滤之
            if (descriptor.getWriteMethod() == null) continue;
            Field field;
            try {
                field = FieldUtils.getField(klass, descriptor.getName(), true);
            } catch (Exception ex) {
                field = null;
            }
            if (field == null) continue;
            //父类中定义的
            if (field.getDeclaringClass() != klass) {
                MetaMember exist = metaModel.getMember(descriptor.getName());
                if( exist != null ) continue;
                Annotation annotation = findAnnotation(descriptor, field, Indicator.class, Metric.class, Config.class);
                if( annotation == null ) continue;
            }
            Class type = findType(descriptor, field);
            if (ManagedObject.class.isAssignableFrom(type)) {
                metaMember = relationResolver.resolve(klass, descriptor, field);
            } else if (Entry.class.isAssignableFrom(type)) {
                metaMember =  relationResolver.resolve(klass, descriptor, field);
            } else {
                Annotation annotation = findAnnotation(descriptor, field, Indicator.class, Metric.class, Config.class);
                // Entry类的字段，可能没有标记，但都作为 Indicator
                // TODO 可用性/性能/配置 三个属性的处理需要根据以后的情况考虑
                if (annotation == null) {
                    if (Entry.class.isAssignableFrom(klass)) {
                        metaMember = indicatorResolver.resolve(klass, descriptor, field);
                    } else {
                        continue;
                    }
                } else {
                    if (annotation instanceof Indicator) {
                        metaMember = indicatorResolver.resolve(klass,  descriptor, field);
                    } else if (annotation instanceof Config) {
                        metaMember = configResolver.resolve(klass, descriptor, field);
                    } else if (annotation instanceof Metric) {
                        metaMember = metricResolver.resolve(klass, descriptor, field);
                    } else {
                        continue;
                    }
                }
            }
            if (metaMember != null) metaModel.register(metaMember);
        }

    }


}
