package dnt.monitor.meta;

import java.io.Serializable;

/**
 * <h1>Meta Information of @Keyed</h1>
 *
 * @author Jay Xiong
 */
public class MetaDepends implements Serializable{

    private static final long serialVersionUID = -4597804166406032463L;

    private String[] value;

    public String[] getValue() {
        return value;
    }

    public void setValue(String[] value) {
        this.value = value;
    }
}
