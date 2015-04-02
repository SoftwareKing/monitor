package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Depends;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.annotation.snmp.Group;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import dnt.monitor.annotation.ssh.Value;
import dnt.monitor.meta.misc.MetaDepends;
import dnt.monitor.meta.misc.MetaKeyed;
import dnt.monitor.meta.snmp.MetaGroup;
import dnt.monitor.meta.snmp.MetaOID;
import dnt.monitor.meta.snmp.MetaTable;
import dnt.monitor.meta.ssh.MetaCommand;
import dnt.monitor.meta.ssh.MetaMapping;
import dnt.monitor.meta.ssh.MetaValue;
import dnt.monitor.model.ManagedObject;
import dnt.monitor.service.MetaService;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.core.ResolvableType;
import org.springframework.core.annotation.AnnotationUtils;

import java.beans.PropertyDescriptor;
import java.lang.annotation.Annotation;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Collection;

import static net.happyonroad.util.StringUtils.translate;

/**
 * <h1>Meta Object Resolver</h1>
 *
 * @author Jay Xiong
 */
public class MetaObjectResolver extends Bean {
    @Autowired
    MessageSource messageSource;
    @Autowired
    MetaService   metaService;

    static Annotation findAnnotation(PropertyDescriptor descriptor, Field field, Class... annotationKlasses) {
        Method writeMethod = descriptor.getWriteMethod();
        if (writeMethod != null) {
            for (Class annotationKlass : annotationKlasses) {
                Annotation annotation = AnnotationUtils.findAnnotation(writeMethod, annotationKlass);
                if (annotation != null) return annotation;
            }
        }

        Method readMethod = descriptor.getReadMethod();
        if (readMethod != null) {
            for (Class annotationKlass : annotationKlasses) {
                Annotation annotation = AnnotationUtils.findAnnotation(readMethod, annotationKlass);
                if (annotation != null) return annotation;
            }
        }

        if (field != null) {
            for (Class annotationKlass : annotationKlasses) {
                Annotation annotation = field.getAnnotation(annotationKlass);
                if (annotation != null) return annotation;
            }
        }

        return null;
    }

    protected MetaKeyed resolveMetaKeyed(Keyed keyed) {
        MetaKeyed metaKeyed = new MetaKeyed();
        metaKeyed.setValue(keyed.value());
        return metaKeyed;
    }

    protected MetaDepends resolveMetaDepends(Depends depends) {
        MetaDepends metaDepends = new MetaDepends();
        metaDepends.setValue(depends.value());
        return metaDepends;
    }

    protected MetaTable resolveSnmpTable(Table table) {
        MetaTable metaTable = new MetaTable();
        metaTable.setValue(table.value());
        metaTable.setPrefix(table.prefix());
        return metaTable;
    }

    protected MetaGroup resolveSnmpGroup(Group group) {
        MetaGroup metaGroup = new MetaGroup();
        metaGroup.setValue(group.value());
        metaGroup.setPrefix(group.prefix());
        return metaGroup;
    }

    protected MetaOID resolveSnmpOID(OID oid) {
        MetaOID metaOID = new MetaOID();
        metaOID.setValue(oid.value());
        return metaOID;
    }


    protected MetaMapping resolveSshMapping(Mapping mapping) {
        MetaMapping metaMapping = new MetaMapping();
        metaMapping.setValue(mapping.value());
        metaMapping.setSkipLines(mapping.skipLines());
        metaMapping.setColSeparator(mapping.colSeparator());
        metaMapping.setRowSeparator(mapping.rowSeparator());
        return metaMapping;
    }

    protected MetaCommand resolveSshCommand(Command command) {
        MetaCommand metaCommand = new MetaCommand();
        metaCommand.setValue(command.value());
        metaCommand.setTimeout(command.timeout());
        return metaCommand;
    }

    protected MetaValue resolveSshValue(Value value) {
        MetaValue metaValue = new MetaValue();
        metaValue.setValue(value.value());
        metaValue.setConverter(value.converter());
        metaValue.setUnitRate(value.unitRate());
        metaValue.setFormat(value.format());
        return metaValue;
    }

    protected Class findType(PropertyDescriptor descriptor, Field field) {
        Class<?> propertyType = descriptor.getPropertyType();
        if (ManagedObject.class.isAssignableFrom(propertyType)) {
            return propertyType;
        } else if (Collection.class.isAssignableFrom(propertyType)) {
            ResolvableType returnType =
                    ResolvableType.forMethodReturnType(descriptor.getReadMethod(), field.getDeclaringClass());
            return (Class) returnType.getGeneric(0).getType();
        } else if (propertyType.isArray()) {
            return propertyType.getComponentType();
        } else if (Array.class.isAssignableFrom(propertyType)) {
            return propertyType.getComponentType();
        } else {
            return descriptor.getPropertyType();
        }
    }

    /**
     * 根据类型寻找资源信息，如果在当前类型上没有找到，则继续向父类型寻找
     *
     * @param klass    对象类型
     * @param suffix   属性名称后缀
     * @param defaults 缺省值
     * @return 字符串
     */
    protected String message(Class klass, String suffix, String defaults) {
        String className = reduceCglibName(klass.getSimpleName());
        try {
            String code;
            if (suffix.startsWith(".")) code = className + suffix;
            else code = className + "." + suffix;
            return translate(messageSource, code);
        } catch (NoSuchMessageException e) {
            if (ManagedObject.class.isAssignableFrom(klass.getSuperclass())) {
                return message(klass.getSuperclass(), suffix, defaults);
            } else {
                return defaults;
            }
        }
    }

    protected String message(Class klass, String suffix) {
        return message(klass, suffix, null);
    }

    static String reduceCglibName(String className) {
        int pos = className.indexOf("$$EnhancerByCGLIB");
        return pos > 0 ? className.substring(0, pos) : className;
    }
}
