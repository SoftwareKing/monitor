package dnt.monitor.support.resolver;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.model.ManagedObject;
import dnt.monitor.service.MetaRelationResolverHelper;
import org.springframework.stereotype.Component;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.util.ServiceLoader;

/**
 * <h1>Meta Relation Resolver</h1>
 *
 * @author Jay Xiong
 */
@Component
public class MetaRelationResolver extends MetaMemberResolver<MetaRelation> {
    static ServiceLoader<MetaRelationResolverHelper> helpers ;
    @Override
    MetaRelation createMetaMember(Class klass, PropertyDescriptor descriptor, Field field) throws MetaException {
        Class type = findType(descriptor, field);
        MetaModel meta = metaService.resolve(type);
        //noinspection unchecked
        return new MetaRelation((Class<? extends ManagedObject>)klass, descriptor, meta);
    }

    @Override
    protected MetaRelation resolve(Class klass, PropertyDescriptor descriptor, Field field) throws MetaException {
        MetaRelation relation = super.resolve(klass, descriptor, field);
        for(MetaRelationResolverHelper helper : helpers()) {
            helper.resolveRelation(descriptor, field, relation);
        }
        return relation;
    }
    public static ServiceLoader<MetaRelationResolverHelper> helpers() {
        if( helpers == null ) helpers = ServiceLoader.load(MetaRelationResolverHelper.class);
        return helpers;
    }
}
