package dnt.monitor.service;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaField;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Helper to resolve meta field</h1>
 *
 * @author Jay Xiong
 */
public interface MetaFieldResolverHelper {
    void resolveField(PropertyDescriptor descriptor, Field field, MetaField metaField) throws MetaException;
}
