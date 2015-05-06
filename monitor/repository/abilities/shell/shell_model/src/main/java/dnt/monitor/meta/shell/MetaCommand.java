package dnt.monitor.meta.shell;

import java.io.Serializable;

/**
 * <h1>SSH Meta Command</h1>
 * <p/>
 * Resolved from <code>@Command</code>
 *
 * @author Jay Xiong
 * @see dnt.monitor.annotation.shell.Command
 */
public class MetaCommand implements Serializable {
    private static final long serialVersionUID = 3496481239883782919L;
    private String value, timeout;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTimeout() {
        return timeout;
    }

    public void setTimeout(String timeout) {
        this.timeout = timeout;
    }

}
