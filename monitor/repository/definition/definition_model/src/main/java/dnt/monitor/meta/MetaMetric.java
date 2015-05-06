/**
 * Developer: Kadvin Date: 15/2/4 上午10:46
 */
package dnt.monitor.meta;

import dnt.monitor.model.ManagedObject;

import java.beans.PropertyDescriptor;
import java.util.ArrayList;
import java.util.List;

/**
 * <h1>@Metric所描述的字段</h1>
 */
public class MetaMetric extends MetaField {
    private   float           critical;
    private   float           warning;
    private   int             occurrences;
    protected List<MetaEvent> metaEvents;

    public MetaMetric(Class<? extends ManagedObject> declaringClass, PropertyDescriptor property) {
        super(declaringClass, property);
        this.metaEvents = new ArrayList<MetaEvent>(4);
    }

    public float getCritical() {
        return critical;
    }

    public void setCritical(float critical) {
        this.critical = critical;
    }

    public float getWarning() {
        return warning;
    }

    public void setWarning(float warning) {
        this.warning = warning;
    }

    public int getOccurrences() {
        return occurrences;
    }

    public void setOccurrences(int occurrences) {
        this.occurrences = occurrences;
    }

    public List<MetaEvent> getEvents() {
        return metaEvents;
    }

    public void addEvent(MetaEvent metaEvent){
        this.metaEvents.add(metaEvent);
    }

}
