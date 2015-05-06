package dnt.monitor.support.resolver;

import dnt.monitor.model.ManagedObject;
import net.happyonroad.spring.Bean;
import org.springframework.core.ResolvableType;
import org.springframework.core.annotation.AnnotationUtils;

import java.beans.PropertyDescriptor;
import java.lang.annotation.Annotation;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Collection;

/**
 * <h1>Meta Resolver Helper</h1>
 *
 * @author Jay Xiong
 */
public class MetaResolverHelper {
    @SuppressWarnings("unchecked")
    protected static <T extends Annotation> T findAnnotation(PropertyDescriptor descriptor, Field field,
                                                   Class... annotationKlasses) {
        Method writeMethod = descriptor.getWriteMethod();
        if (writeMethod != null) {
            for (Class annotationKlass : annotationKlasses) {
                Annotation annotation = AnnotationUtils.findAnnotation(writeMethod, annotationKlass);
                if (annotation != null) return (T) annotation;
            }
        }

        Method readMethod = descriptor.getReadMethod();
        if (readMethod != null) {
            for (Class annotationKlass : annotationKlasses) {
                Annotation annotation = AnnotationUtils.findAnnotation(readMethod, annotationKlass);
                if (annotation != null) return (T) annotation;
            }
        }

        if (field != null) {
            for (Class annotationKlass : annotationKlasses) {
                Annotation annotation = field.getAnnotation(annotationKlass);
                if (annotation != null) return (T) annotation;
            }
        }

        return null;
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
}
