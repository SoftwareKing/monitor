package dnt.monitor.support.resolver;

import dnt.monitor.meta.MetaConfig;
import dnt.monitor.model.ManagedObject;
import org.springframework.stereotype.Component;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Meta Config Resolver</h1>
 *
 * @author Jay Xiong
 */
@Component
public class MetaConfigResolver extends MetaFieldResolver<MetaConfig> {
    @Override
    MetaConfig createMetaMember(PropertyDescriptor descriptor, Field field) {
        //noinspection unchecked
        return new MetaConfig((Class<? extends ManagedObject>) field.getDeclaringClass(), descriptor);
    }
}
