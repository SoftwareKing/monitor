/**
 * Developer: Kadvin Date: 15/2/4 上午10:46
 */
package dnt.monitor.meta;

import dnt.monitor.model.ManagedObject;

import java.beans.PropertyDescriptor;

/**
 * <h1>@Indicator所描述的字段</h1>
 */
public class MetaIndicator extends MetaField {
    public MetaIndicator(Class<? extends ManagedObject> declaringClass, PropertyDescriptor property) {
        super(declaringClass, property);
    }
}
