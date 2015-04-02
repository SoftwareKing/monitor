/**
 * Developer: Kadvin Date: 15/2/4 上午10:46
 */
package dnt.monitor.meta;

import dnt.monitor.model.ManagedObject;

import java.beans.PropertyDescriptor;

/**
 * <h1>@Metric所描述的字段</h1>
 */
public class MetaMetric extends MetaField {
    public MetaMetric(Class<? extends ManagedObject> declaringClass, PropertyDescriptor property) {
        super(declaringClass, property);
    }
}
