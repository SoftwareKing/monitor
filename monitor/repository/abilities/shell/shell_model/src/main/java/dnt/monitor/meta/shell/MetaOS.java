package dnt.monitor.meta.shell;

import net.happyonroad.model.Category;

/**
 * <h1>Meta OS Command/Row/Column Pair</h1>
 *
 * @author Jay Xiong
 */
public class MetaOS implements Comparable<MetaOS>{
    private String type;
    private MetaCommand command;
    private MetaMapping mapping;
    private MetaValue value;
    private String[] args;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public MetaCommand getCommand() {
        return command;
    }

    public void setCommand(MetaCommand command) {
        this.command = command;
    }

    public MetaMapping getMapping() {
        return mapping;
    }

    public void setMapping(MetaMapping mapping) {
        this.mapping = mapping;
    }

    public MetaValue getValue() {
        return value;
    }

    public void setValue(MetaValue value) {
        this.value = value;
    }

    public String[] getArgs() {
        return args;
    }

    public void setArgs(String[] args) {
        this.args = args;
    }

    @Override
    public int compareTo(@SuppressWarnings("NullableProblems") MetaOS o) {
        return depth(o.type) - depth(type);
    }

    static int depth(String type){
        if("*".equals(type)) return 0;
        return Category.depth(type);
    }
}
