package dnt.monitor.meta.snmp;

import java.io.Serializable;

/**
 * <h1>Snmp Group Meta</h1>
 *
 * Resolved from <code>@Group</code>
 *
 * @author Jay Xiong
 * @see dnt.monitor.annotation.snmp.Group
 */
public class MetaGroup implements Serializable{
    private static final long serialVersionUID = -1324562509968409190L;
    private String value, prefix;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }
}
