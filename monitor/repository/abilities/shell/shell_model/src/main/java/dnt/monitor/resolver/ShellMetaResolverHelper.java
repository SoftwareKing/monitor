package dnt.monitor.resolver;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.meta.shell.MetaCommand;
import dnt.monitor.meta.shell.MetaMapping;
import dnt.monitor.meta.shell.MetaShell;
import dnt.monitor.meta.shell.MetaValue;
import dnt.monitor.support.resolver.MetaResolverHelper;
import net.happyonroad.util.MiscUtils;

/**
 * <h1>Shell MetaResolver Helper</h1>
 *
 * @author Jay Xiong
 */
public class ShellMetaResolverHelper extends MetaResolverHelper {

    MetaShell resolveShell(Class klass, Shell shell) {
        MetaShell metaShell = new MetaShell();
        for(OS os: shell.value()){
            MetaCommand metaCommand = null;
            MetaMapping metaMapping = null;
            MetaValue metaValue = null;
            if(!isDefault(os.command())){
                metaCommand = resolveShellCommand(klass, os.command());
            }
            if(!isDefault(os.mapping()) ){
                metaMapping = resolveShellMapping(os.mapping());
            }
            if(!isDefault(os.value())){
                metaValue = resolveShellValue(os.value());
            }
            metaShell.add(os.type(), metaCommand, metaMapping, metaValue, os.args());
        }
        return metaShell;
    }

    protected MetaCommand resolveShellCommand(Class klass, Command command) {
        if( command == null ) return null;
        MetaCommand metaCommand = new MetaCommand();
        String rawValue = command.value();
        String value = MiscUtils.actualContent(klass, rawValue);
        metaCommand.setValue(value);
        metaCommand.setTimeout(command.timeout());
        return metaCommand;
    }

    protected MetaMapping resolveShellMapping(Mapping mapping) {
        if(mapping == null ) return null;
        MetaMapping metaMapping = new MetaMapping();
        metaMapping.setValue(mapping.value());
        metaMapping.setColSeparator(mapping.colSeparator());
        metaMapping.setRowSeparator(mapping.rowSeparator());
        metaMapping.setPattern(mapping.pattern());
        return metaMapping;
    }

    protected MetaValue resolveShellValue(Value value) {
        if( value == null ) return null;
        MetaValue metaValue = new MetaValue();
        metaValue.setValue(value.value());
        metaValue.setConverter(value.converter());
        metaValue.setUnitRate(value.unitRate());
        metaValue.setFormat(value.format());
        return metaValue;
    }

    private boolean isDefault(Command command){
        return "".equals(command.value()) && "1m".equals(command.timeout());
    }

    private boolean isDefault(Mapping mapping){
        return mapping.value().length == 0 &&
               mapping.pattern().isEmpty() &&
               "\\s*\\r?\\n\\s*".equals(mapping.rowSeparator()) &&
               "\\s+".equals(mapping.colSeparator());
    }

    private boolean isDefault(Value aValue) {
        return "".equals(aValue.value()) &&  (1 == aValue.unitRate()) &&
               "".equals(aValue.converter()) && "".equals(aValue.format());
    }

}
