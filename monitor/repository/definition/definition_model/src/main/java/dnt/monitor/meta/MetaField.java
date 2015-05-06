/**
 * Developer: Kadvin Date: 15/2/5 下午7:41
 */
package dnt.monitor.meta;

import dnt.monitor.model.ManagedObject;
import java.beans.PropertyDescriptor;

/**
 * <h1>所有普通成员的元信息</h1>
 */
public class MetaField extends MetaMember {
    private String unit;


    public MetaField(Class<? extends ManagedObject> declaringClass,
                     PropertyDescriptor property) {
        super(declaringClass, property);
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getUnit() {
        return unit;
    }
}
