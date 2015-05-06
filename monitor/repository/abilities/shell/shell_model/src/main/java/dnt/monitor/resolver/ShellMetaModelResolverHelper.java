package dnt.monitor.resolver;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.shell.*;
import dnt.monitor.model.Entry;
import dnt.monitor.model.ManagedObject;
import dnt.monitor.service.MetaModelResolverHelper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * <h1>Shell MetaField Resolver Helper</h1>
 * <p/>
 * 模型(Resource/Component/Link/Entry)上有两种方式定义Shell信息
 * <ul>
 * <li> @Shell -> @OS -> { @Command, @Mapping, @Value} 定义针对特定类型的指令
 * <li> @Command, @Mapping 定义针对所有类型的通用指令
 * </ul>
 * 在一个模型上，可能这2种方式都存在
 * @author Jay Xiong
 */
public class ShellMetaModelResolverHelper extends ShellMetaResolverHelper implements MetaModelResolverHelper {

    public void resolveModel(Class klass, MetaModel metaModel) {
        MetaShell metaShell = new MetaShell();

        //ssh的annotation要继承
        Class processing = klass;
        List<Class> processClasses = new ArrayList<Class>();
        while (processing != ManagedObject.class && processing != Entry.class) {
            processClasses.add(processing);
            processing = processing.getSuperclass();
        }
        //需要从父类向子类写
        Collections.reverse(processClasses);
        for (Class target : processClasses) {
            //先找当前类上面有没有定义 @Match
            Shell shell = (Shell) target.getAnnotation(Shell.class);
            if (shell != null) {
                MetaShell partial = resolveShell(target, shell);
                metaShell.merge(partial);
            }
            Command command = (Command) target.getAnnotation(Command.class);
            Mapping mapping = (Mapping) target.getAnnotation(Mapping.class);
            if (command != null) {
                MetaCommand metaCommand = resolveShellCommand(target, command);
                if (mapping != null) {
                    MetaMapping metaMapping = resolveShellMapping(mapping);
                    metaShell.add(metaCommand, metaMapping);
                } else {
                    metaShell.add(metaCommand);
                }
            } else if (mapping != null) {
                MetaMapping metaMapping = resolveShellMapping(mapping);
                metaShell.add(metaMapping);
            }

        }
        if (!metaShell.isEmpty())
            metaModel.setAttribute(MetaShell.class, metaShell);
    }

}
