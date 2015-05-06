package dnt.monitor.meta.sampling;

import net.happyonroad.model.Category;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * <h1>Meta OS Command/Row/Column Pair</h1>
 *
 * @author Jay Xiong
 */
public class MetaOS implements Serializable,Comparable<MetaOS>{
    private String            type         = "*";
    private List<MetaCommand> metaCommands = new ArrayList<MetaCommand>();
    private List<String>      args         = new ArrayList<String>();
    private MetaTransformer   transformer  = new MetaTransformer();
    private MetaValue metaValue;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<MetaCommand> getMetaCommands() {
        return metaCommands;
    }

    public void setMetaCommands(List<MetaCommand> metaCommands) {
        this.metaCommands = metaCommands;
    }

    public List<String> getArgs() {
        return args;
    }

    public void setArgs(List<String> args) {
        this.args = args;
    }

    public MetaTransformer getTransformer() {
        return transformer;
    }

    public void setTransformer(MetaTransformer transformer) {
        this.transformer = transformer;
    }

    public MetaValue getMetaValue() {
        return metaValue;
    }

    public void setMetaValue(MetaValue metaValue) {
        this.metaValue = metaValue;
    }

    @Override
    public int compareTo(@SuppressWarnings("NullableProblems") MetaOS o) {
        return depth(o.type) - depth(type);
    }

    static int depth(String type){
        if("*".equals(type)) return 0;
        return Category.depth(type);
    }

    private static final long serialVersionUID = -8086329034474754810L;
}
