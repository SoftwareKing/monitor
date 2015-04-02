package dnt.monitor.meta.snmp;

import java.io.Serializable;

/**
 * <h1>SNMP Table Meta</h1>
 *
 * Resolved from <code>@Table</code>
 *
 * @author Jay Xiong
 * @see dnt.monitor.annotation.snmp.Table
 */
public class MetaTable implements Serializable{

    private static final long serialVersionUID = -2870118752294673065L;
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
