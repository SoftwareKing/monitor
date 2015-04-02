package dnt.monitor.support.resolver;

import dnt.monitor.meta.MetaMetric;
import dnt.monitor.model.ManagedObject;
import org.springframework.stereotype.Component;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Meta Metric Resolver</h1>
 *
 * @author Jay Xiong
 */
@Component
public class MetaMetricResolver extends MetaFieldResolver<MetaMetric> {
    @Override
    MetaMetric createMetaMember(PropertyDescriptor descriptor, Field field) {
        //noinspection unchecked
        return new MetaMetric((Class<? extends ManagedObject>) field.getDeclaringClass(), descriptor);
    }
}
