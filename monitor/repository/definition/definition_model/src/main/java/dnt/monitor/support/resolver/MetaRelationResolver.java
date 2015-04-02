package dnt.monitor.support.resolver;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.model.ManagedObject;
import org.springframework.stereotype.Component;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

/**
 * <h1>Meta Relation Resolver</h1>
 *
 * @author Jay Xiong
 */
@Component
public class MetaRelationResolver extends MetaMemberResolver<MetaRelation> {
    @Override
    MetaRelation createMetaMember(PropertyDescriptor descriptor, Field field) throws MetaException {
        Class type = findType(descriptor, field);
        MetaModel meta = metaService.resolve(type);
        //noinspection unchecked
        return new MetaRelation((Class<? extends ManagedObject>) field.getDeclaringClass(), descriptor, meta);
    }
}
