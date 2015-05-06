/**
 * Developer: Kadvin Date: 15/2/4 上午10:45
 */
package dnt.monitor.meta;

import dnt.monitor.model.ManagedObject;

import java.beans.PropertyDescriptor;
import java.util.ArrayList;
import java.util.List;

/**
 * <h1>@Config所描述的字段</h1>
 */
public class MetaConfig extends MetaField {
    protected List<MetaEvent> metaEvents;

    public MetaConfig(Class<? extends ManagedObject> declaringClass, PropertyDescriptor property) {
        super(declaringClass, property);
        this.metaEvents = new ArrayList<MetaEvent>(3);
    }

    public List<MetaEvent> getEvents() {
        return metaEvents;
    }

    public void addEvent(MetaEvent metaEvent){
        this.metaEvents.add(metaEvent);
    }
}
