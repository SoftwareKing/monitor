/**
 * Developer: Kadvin Date: 15/2/5 下午4:03
 */
package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaComponent;
import dnt.monitor.meta.misc.MetaAnchor;
import dnt.monitor.meta.misc.MetaKeyed;
import dnt.monitor.model.Component;
import org.springframework.core.annotation.AnnotationUtils;

/**
 * <h1>解析Component的子类为MetaComponent</h1>
 */
@org.springframework.stereotype.Component
public class MetaComponentResolver extends MetaModelResolver<Component, MetaComponent<Component>>{

    @Override
    MetaComponent<Component> createMetaModel(Class<Component> klass) throws MetaException {
        MetaComponent<Component> metaComponent = new MetaComponent<Component>(klass);
           //需要继承父类的解析结果
        if( Component.class.isAssignableFrom(klass.getSuperclass())){
            //noinspection unchecked
            MetaComponent<Component> parentMeta = (MetaComponent<Component>)metaService.resolve(klass.getSuperclass());
            inherit(metaComponent, parentMeta);
        }
        Anchor anchor = AnnotationUtils.findAnnotation(klass, Anchor.class);
        if( anchor != null ){
            MetaAnchor metaAnchor = resolveMetaAnchor(anchor);
            metaComponent.setAnchor(metaAnchor);
        }
        Keyed keyed = AnnotationUtils.findAnnotation(klass, Keyed.class);
        if( keyed != null ){
            MetaKeyed metaKeyed = resolveMetaKeyed(keyed);
            metaComponent.setKeyed(metaKeyed);
        }

        return metaComponent;
    }

    MetaAnchor resolveMetaAnchor(Anchor anchor) {
        MetaAnchor metaAnchor = new MetaAnchor();
        metaAnchor.setExpression(anchor.expression());
        metaAnchor.setValue(anchor.value());
        metaAnchor.setPrefix(anchor.prefix());
        metaAnchor.setConnector(anchor.connector());
        return metaAnchor;
    }
}
