package dnt.monitor.support.resolver;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.service.MetaFieldResolverHelper;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.util.ServiceLoader;

/**
 * <h1>Meta Field Resolver</h1>
 *
 * @author Jay Xiong
 */
public abstract class MetaFieldResolver<F extends MetaField> extends MetaMemberResolver<F>{
    static ServiceLoader<MetaFieldResolverHelper> helpers ;

    /**
     * <h2>Resolve The meta member of klass, by specified annotation</h2>
     *
     * @param klass      the klass of the meta member defined for
     * @param descriptor the field descriptor
     * @param field      the field
     * @return the resolved meta member
     * @throws MetaException
     */
    protected F resolve(Class klass, PropertyDescriptor descriptor, Field field) throws MetaException {
        F metaField = super.resolve(klass, descriptor, field);
        for(MetaFieldResolverHelper helper : helpers()) {
            helper.resolveField(descriptor, field, metaField);
        }
        return metaField;
    }

    public static ServiceLoader<MetaFieldResolverHelper> helpers() {
        if( helpers == null ) helpers = ServiceLoader.load(MetaFieldResolverHelper.class);
        return helpers;
    }

}
