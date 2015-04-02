package dnt.monitor.meta.misc;

import java.io.Serializable;

/**
 * <h1>Meta Information of @Keyed</h1>
 *
 * @author Jay Xiong
 */
public class MetaKeyed implements Serializable{
    private static final long serialVersionUID = -2780245666818268655L;

    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
