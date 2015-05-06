package dnt.monitor.service;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaRelation;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Helper to resolve meta relation</h1>
 *
 * @author Jay Xiong
 */
public interface MetaRelationResolverHelper {
    void resolveRelation(PropertyDescriptor descriptor, Field field, MetaRelation relation) throws MetaException;
}
