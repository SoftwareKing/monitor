package dnt.monitor.support.resolver;

import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import dnt.monitor.annotation.ssh.Value;
import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.snmp.MetaOID;
import dnt.monitor.meta.ssh.MetaCommand;
import dnt.monitor.meta.ssh.MetaMapping;
import dnt.monitor.meta.ssh.MetaValue;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Meta Field Resolver</h1>
 *
 * @author Jay Xiong
 */
public abstract class MetaFieldResolver<F extends MetaField> extends MetaMemberResolver<F>{
    @Override
    protected F resolve(Class klass, PropertyDescriptor descriptor, Field field) throws MetaException {
        F metaField = super.resolve(klass, descriptor, field);
        resolveSnmp(descriptor, field, metaField);
        resolveSsh(descriptor, field, metaField);
        return metaField;
    }

    protected void resolveSnmp(PropertyDescriptor descriptor, Field field, MetaField metaField) {
        OID oid = (OID) findAnnotation(descriptor, field, OID.class);
        if( oid != null ) {
            MetaOID metaOID = resolveSnmpOID(oid);
            metaField.setOID(metaOID);
        }

    }

    protected void resolveSsh(PropertyDescriptor descriptor, Field field, MetaField metaField) {
        Command command = (Command) findAnnotation(descriptor,  field, Command.class);
        if( command != null ){
            MetaCommand metaCommand = resolveSshCommand(command);
            metaField.setCommand(metaCommand);
        }
        Mapping mapping = (Mapping) findAnnotation(descriptor,  field, Mapping.class);
        if( mapping != null ) {
            MetaMapping metaMapping = resolveSshMapping(mapping);
            metaField.setMapping(metaMapping);
        }
        Value value = (Value) findAnnotation(descriptor,  field, Value.class);
        if( value != null ){
            MetaValue metaValue = resolveSshValue(value);
            metaField.setValue(metaValue);
        }
    }
}
