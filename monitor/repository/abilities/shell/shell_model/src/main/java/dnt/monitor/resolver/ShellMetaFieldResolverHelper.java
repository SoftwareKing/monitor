package dnt.monitor.resolver;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.shell.*;
import dnt.monitor.service.MetaFieldResolverHelper;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Shell MetaField Resolver Helper</h1>
 *
 * @author Jay Xiong
 */
public class ShellMetaFieldResolverHelper extends ShellMetaResolverHelper implements MetaFieldResolverHelper {
    @Override
    public void resolveField(PropertyDescriptor descriptor, Field field, MetaField metaField) {
        MetaShell metaShell = new MetaShell();

        Shell shell = findAnnotation(descriptor, field, Shell.class);
        Class<?> klass = field.getDeclaringClass();
        if (shell != null) {
            MetaShell partial = resolveShell(klass, shell);
            metaShell.merge(partial);
        }

        Command command = findAnnotation(descriptor, field, Command.class);
        Mapping mapping = findAnnotation(descriptor, field, Mapping.class);
        Value value = findAnnotation(descriptor, field, Value.class);
        Args args = findAnnotation(descriptor,field, Args.class);
        String[] realArgs = args == null ? new String[0] :  args.value();
        MetaCommand metaCommand = resolveShellCommand(klass, command);
        MetaMapping metaMapping = resolveShellMapping(mapping);
        MetaValue metaValue = resolveShellValue(value);
        if( metaCommand != null || metaMapping != null | metaValue != null || realArgs.length > 0){
            metaShell.add(metaCommand, metaMapping, metaValue, realArgs);
        }

        if (!metaShell.isEmpty())
            metaField.setAttribute(MetaShell.class, metaShell);
    }

}
