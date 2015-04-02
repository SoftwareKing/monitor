package dnt.monitor.meta.snmp;

import java.io.Serializable;

/**
 * <h1>SNMP OID Meta</h1>
 * <p/>
 * Resolved from <code>@OID</code>
 *
 * @author Jay Xiong
 * @see dnt.monitor.annotation.snmp.OID
 */
public class MetaOID implements Serializable {
    private static final long serialVersionUID = 6169904349423018161L;

    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
