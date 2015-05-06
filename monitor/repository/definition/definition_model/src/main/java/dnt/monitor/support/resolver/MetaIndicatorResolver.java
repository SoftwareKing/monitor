package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Indicator;
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
    MetaIndicator createMetaMember(Class klass, PropertyDescriptor descriptor, Field field) {
        //noinspection unchecked
        MetaIndicator metaIndicator = new MetaIndicator(klass, descriptor);
        //entry的属性没有@Indicator标记，但被视为indicator
        Indicator indicator = findAnnotation(descriptor, field, Indicator.class);
        if( indicator != null ){
            metaIndicator.setUnit(indicator.unit());
        }
        return metaIndicator;
    }
}
