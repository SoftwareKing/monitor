package dnt.monitor.resolver;

import dnt.monitor.annotation.snmp.*;
import dnt.monitor.meta.MetaSnmp;
import dnt.monitor.meta.MetaSnmpCommand;
import dnt.monitor.meta.sampling.*;
import dnt.monitor.support.resolver.DefaultMetaResolverHelper;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Snmp MetaResolver Helper</h1>
 *
 * @author Jay Xiong
 */
public class SnmpMetaResolverHelper extends DefaultMetaResolverHelper<MetaSnmp> {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    protected MetaSnmp resolveFromField(PropertyDescriptor descriptor, Field field) {
        Class clazz = field.getDeclaringClass();
        Snmp snmp = findAnnotation(descriptor, field, Snmp.class);
        OS os = findAnnotation(descriptor, field, OS.class);
        Table table = findAnnotation(descriptor, field, Table.class);
        Group group = findAnnotation(descriptor, field, Group.class);
        OID oid = findAnnotation(descriptor, field, OID.class);
        Transformer transformer = findAnnotation(descriptor, field, Transformer.class);

        return buildMetaSnmp(clazz, snmp, os, table, group, oid, transformer);
    }

    @Override
    protected MetaSnmp resolveFromModel(Class clazz) {
        Snmp snmp = (Snmp) clazz.getAnnotation(Snmp.class);
        OS os = (OS) clazz.getAnnotation(OS.class);
        Table table = (Table) clazz.getAnnotation(Table.class);
        Group group = (Group) clazz.getAnnotation(Group.class);
        OID oid = (OID) clazz.getAnnotation(OID.class);
        Transformer transformer = (Transformer) clazz.getAnnotation(Transformer.class);

        return buildMetaSnmp(clazz, snmp, os, table, group, oid, transformer);
    }

    private MetaSnmp buildMetaSnmp(Class clazz, Snmp snmp, OS os, Table table, Group group, OID oid,
                                   Transformer transformer) {
        MetaSnmp metaSnmp = resolverSnmp(clazz, snmp);
        if (!isNotEmpty(metaSnmp)) {
            metaSnmp = new MetaSnmp();
        }
        MetaOS metaOS = resolverOS(clazz, os);
        if (isNotEmpty(metaOS)) {
            merge(metaSnmp, metaOS);
        }

        metaOS = new MetaOS();
        MetaCommand metaTable = resolverTable(clazz, table);
        MetaCommand metaGroup = resolverGroup(clazz, group);
        MetaValue metaOID = resolverOID(oid);
        MetaTransformer metaTransformer = resolverTransformer(transformer);
        if (isNotEmpty(metaTable)) {
            metaOS.getMetaCommands().add(metaTable);
        }
        if (isNotEmpty(metaGroup)) {
            metaOS.getMetaCommands().add(metaGroup);
        }
        if (isNotEmpty(metaOID)) {
            metaOS.setMetaValue(metaOID);
        }
        if (isNotEmpty(metaTransformer)) {
            metaOS.setTransformer(metaTransformer);
        }

        return merge(metaSnmp, metaOS);
    }

    private MetaSnmp merge(MetaSnmp snmp, MetaOS anotherOS) {
        if (isNotEmpty(anotherOS)) {
            boolean found = false;
            for (MetaOS os : snmp.getOsList()) {
                if (os.getType().equalsIgnoreCase(anotherOS.getType())) {
                    if (isNotEmpty(anotherOS.getMetaValue())) {
                        os.setMetaValue(anotherOS.getMetaValue());
                    }
                    if (isNotEmpty(anotherOS.getTransformer())) {
                        os.setMetaValue(anotherOS.getMetaValue());
                    }
                    if (anotherOS.getArgs() != null && anotherOS.getArgs().size() > 0) {
                        os.setArgs(anotherOS.getArgs());
                    }
                    if (anotherOS.getMetaCommands() != null && anotherOS.getMetaCommands().size() > 0) {
                        for (MetaCommand metaCommand : anotherOS.getMetaCommands()) {
                            merge(os, metaCommand);
                        }
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                snmp.getOsList().add(anotherOS);
            }
        }
        return snmp;
    }

    private MetaOS merge(MetaOS metaOS, MetaCommand metaCommand) {
        if (isNotEmpty(metaCommand)) {
            MetaCommand found = null;
            for (MetaCommand command : metaOS.getMetaCommands()) {
                if (command.getMappingName().equals(metaCommand.getMappingName())) {
                    found = command;
                    break;
                }
            }
            if (found != null) {
                metaOS.getMetaCommands().remove(found);
            }
            metaOS.getMetaCommands().add(metaCommand);
        }

        return metaOS;
    }

    private MetaSnmpCommand resolverTable(Class clazz, Table table) {
        if (table == null) {
            return null;
        }
        MetaSnmpCommand metaCommand = new MetaSnmpCommand();
        metaCommand.setMappingType(MappingType.TABLE);
        metaCommand.setMappingName(table.name());
        String rawValue = table.value();
        String value = actualContent(clazz, rawValue);
        metaCommand.setValue(value);
        metaCommand.setTimeout(table.timeout());
        metaCommand.setPrefix(table.prefix());
        if (isNotEmpty(metaCommand)) {
            return metaCommand;
        } else {
            return null;
        }
    }

    private MetaSnmpCommand resolverGroup(Class clazz, Group group) {
        if (group == null) {
            return null;
        }
        MetaSnmpCommand metaCommand = new MetaSnmpCommand();
        metaCommand.setMappingType(MappingType.MAP);
        metaCommand.setMappingName(group.name());
        String rawValue = group.value();
        String value = actualContent(clazz, rawValue);
        metaCommand.setValue(value);
        metaCommand.setTimeout(group.timeout());
        metaCommand.setPrefix(group.prefix());
        if (isNotEmpty(metaCommand)) {
            return metaCommand;
        } else {
            return null;
        }
    }

    private boolean isNotEmpty(MetaCommand command) {
        return command != null && StringUtils.isNotBlank(command.getValue());
    }

    private MetaValue resolverOID(OID oid) {
        if (oid == null) {
            return null;
        }
        MetaValue metaValue = new MetaValue();
        if (StringUtils.isNotBlank(oid.constantValue())) {  //设置常量将覆盖变量
            metaValue.setConstantValue(oid.constantValue());
        } else {
            metaValue.setValue(oid.value());
        }
        metaValue.setUnitRate(oid.unitRate());
        if (isNotEmpty(metaValue)) {
            return metaValue;
        } else {
            return null;
        }
    }

    private boolean isNotEmpty(MetaValue value) {
        return value != null && (StringUtils.isNotBlank(value.getValue()) || (value.getConstantValue() != null &&
                                                                              StringUtils.isNotBlank(
                                                                                      value.getConstantValue()
                                                                                           .toString()
                                                                                                    )));
    }

    private MetaTransformer resolverTransformer(Transformer transformer) {
        if (transformer == null) {
            return null;
        }
        MetaTransformer metaTransformer = new MetaTransformer();
        metaTransformer.setClazz(transformer.value());
        if (isNotEmpty(metaTransformer)) {
            return metaTransformer;
        } else {
            return null;
        }
    }

    private boolean isNotEmpty(MetaTransformer metaTransformer) {
        return metaTransformer != null && metaTransformer.getClazz() != null &&
               !metaTransformer.getClazz().isInterface();
    }

    private MetaOS resolverOS(Class clazz, OS os) {
        if (os == null) {
            return null;
        }
        MetaOS metaOS = new MetaOS();
        for (Table table : os.tables()) {
            MetaSnmpCommand command = resolverTable(clazz, table);
            if (isNotEmpty(command)) {
                metaOS.getMetaCommands().add(resolverTable(clazz, table));
            }
        }
        for (Group group : os.groups()) {
            MetaSnmpCommand command = resolverGroup(clazz, group);
            if (isNotEmpty(command)) {
                metaOS.getMetaCommands().add(command);
            }
        }
        metaOS.setType(os.type());
        metaOS.setMetaValue(resolverOID(os.oid()));
        MetaTransformer metaTransformer = resolverTransformer(os.transformer());
        if (isNotEmpty(metaTransformer)) {
            metaOS.setTransformer(resolverTransformer(os.transformer()));
        }
        if (isNotEmpty(metaOS)) {
            return metaOS;
        } else {
            return null;
        }
    }

    private boolean isNotEmpty(MetaOS os) {
        return os != null && ((os.getMetaCommands() != null && os.getMetaCommands().size() > 0) ||
                              (os.getArgs() != null && os.getArgs().size() > 0) ||
                              (os.getMetaValue() != null && isNotEmpty(os.getMetaValue())));
    }

    private MetaSnmp resolverSnmp(Class clazz, Snmp snmp) {
        if (snmp == null) {
            return null;
        }
        MetaSnmp metaSnmp = new MetaSnmp();
        for (OS os : snmp.value()) {
            metaSnmp.getOsList().add(resolverOS(clazz, os));
        }
        if (isNotEmpty(metaSnmp)) {
            return metaSnmp;
        } else {
            return null;
        }
    }
}
