package dnt.monitor.engine.jmx.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import net.happyonroad.spring.Bean;
import net.happyonroad.support.DefaultGeneralMap;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.stereotype.Component;

import javax.management.openmbean.CompositeDataSupport;
import javax.management.openmbean.TabularDataSupport;
import java.beans.PropertyDescriptor;
import java.util.Map;
import java.util.Properties;

/**
 * <h1>The Jmx Field Computer</h1>
 *
 * @author Jay Xiong
 */
@Component
class JmxFieldComputer extends Bean implements FieldComputer {
    @Override
    public Object computeField(String type, MetaField metaField, Map<String, Object> valueMap) throws SampleException {
        Object value = valueMap.get(metaField.getName());
        Class<?> valueType = metaField.getProperty().getPropertyType();
        if (value instanceof CompositeDataSupport) {
            value = convertCompositeData(valueType, (CompositeDataSupport) value);
        } else if (value instanceof TabularDataSupport) {
            value = convertTabularData(valueType, (TabularDataSupport) value);
        }
        return value;
    }

    Object convertCompositeData(Class<?> valueType, CompositeDataSupport composite) {
        Object newValue;
        try {
            newValue = valueType.newInstance();
        } catch (Exception e) {
            logger.error("Can't new instance of {}, because: {}",
                         valueType.getSimpleName(), MiscUtils.describeException(e));
            return null;
        }

        PropertyDescriptor[] descriptors = PropertyUtils.getPropertyDescriptors(valueType);
        for (PropertyDescriptor descriptor : descriptors) {
            try {
                if (!composite.containsKey(descriptor.getName())) continue;
                Object fieldValue = composite.get(descriptor.getName());
                PropertyUtils.setProperty(newValue, descriptor.getName(), fieldValue);
            } catch (Exception e) {
                logger.warn("Can't apply {} from {} to {}, because of {}",
                            descriptor.getName(), composite, newValue, MiscUtils.describeException(e));
            }
        }
        return newValue;
    }

    Map convertTabularData(Class<?> valueType, TabularDataSupport tabular) {
        Map map;
        if (Properties.class.isAssignableFrom(valueType)) {
            map = new Properties();
        } else {
            map = new DefaultGeneralMap();
        }
        for (Object o : tabular.values()) {
            if (o instanceof CompositeDataSupport) {
                CompositeDataSupport composite = (CompositeDataSupport) o;
                Object[] objects = composite.values().toArray(new Object[2]);
                //noinspection unchecked
                map.put(objects[0], objects[1]);
            }
        }
        return map;
    }
}
