/**
 * Developer: Kadvin Date: 15/2/5 下午7:41
 */
package dnt.monitor.meta;

import dnt.monitor.meta.snmp.MetaOID;
import dnt.monitor.meta.ssh.MetaCommand;
import dnt.monitor.meta.ssh.MetaMapping;
import dnt.monitor.meta.ssh.MetaValue;
import dnt.monitor.model.ManagedObject;
import java.beans.PropertyDescriptor;

/**
 * <h1>所有普通成员的元信息</h1>
 */
public class MetaField extends MetaMember {
    private String unit;

    private MetaCommand command;
    private MetaMapping mapping;
    private MetaValue   value;
    private MetaOID     oid;


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

    public MetaOID getOID() {
        return oid;
    }

    public void setOID(MetaOID oid) {
        this.oid = oid;
    }

    public MetaCommand getCommand() {
        return command;
    }

    public void setCommand(MetaCommand command) {
        this.command = command;
    }

    public MetaMapping getMapping() {
        return mapping;
    }

    public void setMapping(MetaMapping mapping) {
        this.mapping = mapping;
    }

    public MetaValue getValue() {
        return value;
    }

    public void setValue(MetaValue value) {
        this.value = value;
    }
}
