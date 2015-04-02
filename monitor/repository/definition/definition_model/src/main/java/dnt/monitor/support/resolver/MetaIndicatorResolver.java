package dnt.monitor.support.resolver;

import dnt.monitor.meta.MetaIndicator;
import dnt.monitor.model.ManagedObject;
import org.springframework.stereotype.Component;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Meta Indicator Resolver</h1>
 *
 * @author Jay Xiong
 */
@Component
public class MetaIndicatorResolver extends MetaFieldResolver<MetaIndicator> {
    @Override
    MetaIndicator createMetaMember(PropertyDescriptor descriptor, Field field) {
        //noinspection unchecked
        return new MetaIndicator((Class<? extends ManagedObject>) field.getDeclaringClass(), descriptor);
    }
}
