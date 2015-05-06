package dnt.monitor.resolver;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.service.MetaModelResolverHelper;
import dnt.monitor.support.resolver.MetaResolverHelper;
import org.springframework.core.annotation.AnnotationUtils;

import javax.management.MalformedObjectNameException;

/**
 * <h1>JMX Meta Model Resolver Helper</h1>
 *
 * @author Jay Xiong
 */
public class JmxMetaModelResolverHelper extends JmxMetaResolverHelper implements MetaModelResolverHelper {
    @Override
    public void resolveModel(Class klass, MetaModel metaModel) throws MetaException {
        ObjectName  anObjectName = AnnotationUtils.findAnnotation(klass, ObjectName.class);
        if (anObjectName != null ){
            javax.management.ObjectName objectName = resolveObjectName(anObjectName);
            metaModel.setAttribute(javax.management.ObjectName.class, objectName);
        }
    }
}
