/**
 * Developer: Kadvin Date: 15/2/5 下午4:03
 */
package dnt.monitor.support.resolver;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaEntry;
import dnt.monitor.model.Entry;

/**
 * <h1>解析Entry的子类为MetaEntry</h1>
 */
@org.springframework.stereotype.Component
public class MetaEntryResolver extends MetaModelResolver<Entry, MetaEntry<Entry>>{
    @Override
    MetaEntry<Entry> createMetaModel(Class<Entry> klass) throws MetaException {
        MetaEntry<Entry> metaEntry = new MetaEntry<Entry>(klass);
        //需要继承父类的解析结果
        if( Entry.class.isAssignableFrom(klass.getSuperclass())){
            //noinspection unchecked
            MetaEntry<Entry> parentMeta = (MetaEntry<Entry>)metaService.resolve(klass.getSuperclass());
            inherit(metaEntry, parentMeta);
        }
        return metaEntry;
    }
}
