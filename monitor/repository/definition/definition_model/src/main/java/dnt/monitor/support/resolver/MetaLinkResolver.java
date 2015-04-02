/**
 * Developer: Kadvin Date: 15/2/5 下午4:03
 */
package dnt.monitor.support.resolver;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaLink;
import dnt.monitor.model.Link;
import org.springframework.stereotype.Component;

/**
 * <h1>解析Link的子类为MetaLink</h1>
 */
@Component
public class MetaLinkResolver extends MetaModelResolver<Link, MetaLink<Link>>{
    @Override
    MetaLink<Link> createMetaModel(Class<Link> klass) throws MetaException {
        MetaLink<Link> metaLink = new MetaLink<Link>(klass);
        //需要继承父类的解析结果
        if( Link.class.isAssignableFrom(klass.getSuperclass())){
            //noinspection unchecked
            MetaLink<Link> parentMeta = (MetaLink<Link>)metaService.resolve(klass.getSuperclass());
            inherit(metaLink, parentMeta);
        }
        return metaLink;
    }

}
