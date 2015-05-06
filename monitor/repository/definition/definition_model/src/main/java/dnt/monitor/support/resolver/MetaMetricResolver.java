package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Metric;
import dnt.monitor.meta.MetaEvent;
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
    MetaMetric createMetaMember(Class klass, PropertyDescriptor descriptor, Field field) {
        //noinspection unchecked
        MetaMetric metaMetric = new MetaMetric((Class<? extends ManagedObject>) klass, descriptor);
        Metric metric = findAnnotation(descriptor, field, Metric.class);
        // meta metric的解析出来，一定有对应的 @Metric的定义
        metaMetric.setCritical(metric.critical());
        metaMetric.setWarning(metric.warning());
        metaMetric.setOccurrences(metric.occurrences());
        metaMetric.setUnit(metric.unit());

        String source = field.getDeclaringClass().getSimpleName();
        String property = descriptor.getName();
        //在元模型上翻译事件时，先不管critical或者warning的值，因为policy可能会修改
        // 也就是，即便元模型没有定义这2个阈值，仍然应该发出事件
        // 或者说，红黄阈值是metric必须有的属性？开发者必须指定?
        // 但对于部分性能指标，开发者需要仅做记录，不做事件时，必须指定的metric的critical/warning阈值反而会增大开发者的工作量
        // 所以，暂定：metric可以不设置2个阈值，不设置的时候，意味着不会触发内部事件，自然也无从影响状态，或者生成告警
        MetaEvent[] events = new MetaEvent[4];
        events[0] = new MetaEvent(source, property, "Critical");
        events[1] = new MetaEvent(source, property, "Warning");
        events[2] = new MetaEvent(source, property, "Normal");
        events[3] = new MetaEvent(source, property, "Unknown");
        for (MetaEvent event : events) {
            translateEventLabel(field.getDeclaringClass(), event, message("Syntax.Metric", ""));
            if(metric.critical() != 0 && metric.warning() != 0 ){
                translateEventDescription(field.getDeclaringClass(), event,
                                          metric.critical(), metric.warning(), metric.unit());
            }
            metaMetric.addEvent(event);
        }

        return metaMetric;
    }
}
