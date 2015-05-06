package dnt.monitor.meta.shell;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * <h1>Meta Match</h1>
 *
 * @author Jay Xiong
 */
public class MetaShell {
    private List<MetaOS> osList = new ArrayList<MetaOS>();

    /**
     * <h2>获取与os匹配的所有命令</h2>
     * 如: 当前os为: /device/host/linux/centos
     * 则可以获取到 centos上面的命令; linux上面的命令; host上面的命令
     *
     * @param type OS type, like /device/host/linux/centos
     * @return 命令列表，按照匹配度排序，最优先的排在最前面
     */
    public List<MetaCommand> getCommands(String type) {
        List<MetaOS> list = filter(type);
        List<MetaCommand> commands = new ArrayList<MetaCommand>(list.size());
        for (MetaOS os : list) {
            if (os.getCommand() != null) commands.add(os.getCommand());
        }
        return commands;
    }

    /**
     * <h2>获取与os最匹配的命令</h2>
     * 如: os为: /device/host/linux/centos
     * 则优先仅返回centos上面的命令; 如果没有，才返回 linux上面的命令;
     *
     * @param type OS type, like /device/host/linux/centos
     * @return 最匹配的命令，如果没有，返回null
     */
    public MetaCommand getCommand(String type) {
        List<MetaCommand> commands = getCommands(type);
        if (commands.isEmpty()) return null;
        return commands.get(0);
    }

    /**
     * <h2>获取与os匹配的所有映射</h2>
     * 如: 当前os为: /device/host/linux/centos
     * 则可以获取到 centos上面的映射; linux上面的映射; host上面的映射
     *
     * @param type OS type, like /device/host/linux/centos
     * @return 映射列表，按照匹配度排序，最优先的排在最前面
     */
    public List<MetaMapping> getMappings(String type) {
        List<MetaOS> list = filter(type);
        List<MetaMapping> mappings = new ArrayList<MetaMapping>(list.size());
        for (MetaOS os : list) {
            if (os.getMapping() != null) mappings.add(os.getMapping());
        }
        return mappings;
    }

    /**
     * <h2>获取与os最匹配的映射</h2>
     * 如: os为: /device/host/linux/centos
     * 则优先仅返回centos上面的映射; 如果没有，才返回 linux上面的映射;
     *
     * @param type OS type, like /device/host/linux/centos
     * @return 最匹配的映射，如果没有，返回null
     */
    public MetaMapping getMapping(String type) {
        List<MetaMapping> mappings = getMappings(type);
        if (mappings.isEmpty()) return null;
        return mappings.get(0);
    }

    /**
     * <h2>获取与os匹配的所有值映射</h2>
     * 如: 当前os为: /device/host/linux/centos
     * 则可以获取到 centos上面的值映射; linux上面的值映射; host上面的值映射
     *
     * @param type OS type, like /device/host/linux/centos
     * @return 值映射列表，按照匹配度排序，最优先的排在最前面
     */
    public List<MetaValue> getValues(String type) {
        List<MetaOS> list = filter(type);
        List<MetaValue> values = new ArrayList<MetaValue>(list.size());
        for (MetaOS os : list) {
            if (os.getValue() != null) values.add(os.getValue());
        }
        return values;
    }

    /**
     * <h2>获取与os最匹配的值映射</h2>
     * 如: os为: /device/host/linux/centos
     * 则优先仅返回centos上面的值映射; 如果没有，才返回 linux上面的值映射;
     *
     * @param type OS type, like /device/host/linux/centos
     * @return 最匹配的值映射，如果没有，返回null
     */
    public MetaValue getValue(String type) {
        List<MetaValue> values = getValues(type);
        if (values.isEmpty()) return null;
        return values.get(0);
    }

    public List<String[]> getArgsList(String type) {
        List<MetaOS> list = filter(type);
        List<String[]> argsList = new ArrayList<String[]>(list.size());
        for (MetaOS os : list) {
            if (os.getArgs() != null && os.getArgs().length > 0 )
                argsList.add(os.getArgs());
        }
        return argsList;
    }

    public String[] getArgs(String type) {
        List<String[]> argsList = getArgsList(type);
        if (argsList.isEmpty()) return new String[0];
        return argsList.get(0);
    }

    @JsonIgnore
    public boolean isEmpty() {
        return osList.isEmpty();
    }

    public void merge(MetaShell another) {
        if (another == null) return;
        for (MetaOS os : another.osList) {
            add(os.getType(), os.getCommand(), os.getMapping(), os.getValue(), os.getArgs());
        }
    }

    MetaOS getMetaOs(String type) {
        for (MetaOS os : osList) {
            if (type.equals(os.getType())) return os;
        }
        return null;
    }

    public MetaOS add(String type,
                      MetaCommand metaCommand,
                      MetaMapping metaMapping,
                      MetaValue metaValue,
                      String[] args) {
        //Reject all null
        if( metaCommand == null && metaMapping == null && metaValue == null
            && (args == null || args.length == 0) )
            return null;
        MetaOS target = getMetaOs(type);
        if (target == null) {
            target = new MetaOS();
            target.setType(type);
            osList.add(target);
        }
        if (metaCommand != null)
            target.setCommand(metaCommand);
        if (metaMapping != null)
            target.setMapping(metaMapping);
        if (metaValue != null) {
            target.setValue(metaValue);
        }
        if( args != null && args.length > 0 ){
            target.setArgs(args);
        }
        return target;
    }

    public MetaOS add(MetaCommand metaCommand, MetaMapping metaMapping, MetaValue metaValue, String[] args) {
        return add("*", metaCommand, metaMapping, metaValue, args);
    }

    public MetaOS add(String type, MetaCommand metaCommand, MetaMapping metaMapping) {
        return add(type, metaCommand, metaMapping, null, null);
    }

    public MetaOS add(MetaCommand metaCommand, MetaMapping metaMapping) {
        return add(metaCommand, metaMapping, null, null);
    }

    public MetaOS add(MetaCommand metaCommand) {
        return add(metaCommand, null);
    }

    public MetaOS add(MetaMapping metaMapping) {
        return add(null, metaMapping);
    }

    List<MetaOS> filter(String type) {
        List<MetaOS> found = new ArrayList<MetaOS>();
        // os#type = linux, linux/centos, *
        for (MetaOS os : osList) {
            if (type.contains(os.getType()) || os.getType().equals("*"))
                found.add(os);
        }
        Collections.sort(found);
        return found;
    }
}
