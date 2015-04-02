package dnt.monitor.meta.misc;

import java.io.Serializable;

/**
 * <h1>Meta Information of @Anchor</h1>
 *
 * @author Jay Xiong
 */
public class MetaAnchor implements Serializable {

    private static final long serialVersionUID = 7339859089349228679L;

    private String expression, prefix, value, connector;

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getConnector() {
        return connector;
    }

    public void setConnector(String connector) {
        this.connector = connector;
    }
}
