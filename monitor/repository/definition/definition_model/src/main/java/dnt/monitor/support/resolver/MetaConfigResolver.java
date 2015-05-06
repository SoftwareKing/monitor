package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Config;
import dnt.monitor.meta.MetaConfig;
import dnt.monitor.meta.MetaEvent;
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
    MetaConfig createMetaMember(Class klass, PropertyDescriptor descriptor, Field field) {
        //noinspection unchecked
        MetaConfig metaConfig = new MetaConfig((Class<? extends ManagedObject>) klass, descriptor);
        Config config = findAnnotation(descriptor, field, Config.class);
        metaConfig.setUnit(config.unit());

        String source = field.getDeclaringClass().getSimpleName();
        String property = descriptor.getName();
        MetaEvent[] events = new MetaEvent[3];
        events[0] = new MetaEvent(source, property, "Changed");
        events[1] = new MetaEvent(source, property, "Unchanged");
        events[2] = new MetaEvent(source, property, "Unknown");
        for (MetaEvent event : events) {
            translateEventLabel(field.getDeclaringClass(), event, message("Syntax.Config", ""));
            metaConfig.addEvent(event);
        }
        return metaConfig;
    }
}
