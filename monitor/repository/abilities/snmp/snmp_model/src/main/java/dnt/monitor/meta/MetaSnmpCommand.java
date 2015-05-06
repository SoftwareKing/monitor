package dnt.monitor.meta;

import dnt.monitor.meta.sampling.MetaCommand;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class MetaSnmpCommand extends MetaCommand {

    public String prefix = "";

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }
}
