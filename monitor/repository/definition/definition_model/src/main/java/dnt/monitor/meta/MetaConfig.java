/**
 * Developer: Kadvin Date: 15/2/4 上午10:45
 */
package dnt.monitor.meta;

import dnt.monitor.model.ManagedObject;

import java.beans.PropertyDescriptor;

/**
 * <h1>@Config所描述的字段</h1>
 */
public class MetaConfig extends MetaField {
    public MetaConfig(Class<? extends ManagedObject> declaringClass, PropertyDescriptor property) {
        super(declaringClass, property);
    }
}
