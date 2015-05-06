package dnt.monitor.model.meta;

import dnt.monitor.model.Entry;

/**
 * <h1>JMX Entry</h1>
 *
 * @author Jay Xiong
 */
public class JmxEntry extends Entry{
    private static final long serialVersionUID = 1916556558719772199L;
    private String name, label, description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
