package dnt.monitor.resolver;

import dnt.monitor.annotation.jmx.ObjectAttr;
import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.service.MetaFieldResolverHelper;
import dnt.monitor.service.MetaModelResolverHelper;
import dnt.monitor.support.resolver.MetaResolverHelper;
import org.springframework.core.annotation.AnnotationUtils;

import javax.management.Attribute;
import javax.management.MalformedObjectNameException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>JMX Meta Field Resolver Helper</h1>
 *
 * @author Jay Xiong
 */
public class JmxMetaFieldResolverHelper extends JmxMetaResolverHelper implements MetaFieldResolverHelper {

    @Override
    public void resolveField(PropertyDescriptor descriptor, Field field, MetaField metaField) throws MetaException {
        ObjectName  anObjectName = findAnnotation(descriptor, field, ObjectName.class);
        ObjectAttr anObjectAttr = findAnnotation(descriptor, field, ObjectAttr.class);
        if (anObjectName != null ){
            javax.management.ObjectName objectName = resolveObjectName(anObjectName);
            metaField.setAttribute(javax.management.ObjectName.class, objectName);
        }
        if( anObjectAttr != null ){
            //Attribute的 name即为对象名称，value为缺省值
            Attribute attribute = resolveObjectAttr(anObjectAttr);
            metaField.setAttribute(Attribute.class, attribute);
        }
    }

}
