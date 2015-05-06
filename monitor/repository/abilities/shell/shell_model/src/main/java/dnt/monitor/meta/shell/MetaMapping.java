package dnt.monitor.meta.shell;

import java.io.Serializable;

/**
 * <h1>Class Title</h1>
 *
 * @author Jay Xiong
 */
public class MetaMapping implements Serializable {
    private static final long serialVersionUID = -4370199649386566580L;

    private String[] value;

    private String rowSeparator, colSeparator;
    String pattern;

    public String[] getValue() {
        return value;
    }

    public void setValue(String[] value) {
        this.value = value;
    }

    public String getRowSeparator() {
        return rowSeparator;
    }

    public void setRowSeparator(String rowSeparator) {
        this.rowSeparator = rowSeparator;
    }

    public String getColSeparator() {
        return colSeparator;
    }

    public void setColSeparator(String colSeparator) {
        this.colSeparator = colSeparator;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }
}
