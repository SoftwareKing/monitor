/**
 * Developer: Kadvin Date: 15/2/5 下午4:03
 */
package dnt.monitor.support.resolver;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Resource;
import dnt.monitor.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <h1>解析Resource的子类为MetaResource</h1>
 */
@Component
public class MetaResourceResolver extends MetaModelResolver<Resource, MetaResource<Resource>> {
    @Autowired
    CategoryService categoryService;

    @SuppressWarnings("unchecked")
    @Override
    MetaResource<Resource> createMetaModel(Class<Resource> klass) throws MetaException {
        MetaResource<Resource> metaResource = new MetaResource<Resource>(klass);
        //需要继承父类的解析结果
        if( Resource.class.isAssignableFrom(klass.getSuperclass())){
            MetaResource<Resource> parentMeta = (MetaResource<Resource>)metaService.resolve(klass.getSuperclass());
            inherit(metaResource, parentMeta);
        }
        net.happyonroad.model.Category category;
        category = categoryService.resolve(klass);
        metaResource.setName(category.getType());
        metaResource.setLabel(category.getLabel());
        metaResource.setCategory(category);

        return metaResource;
    }

}
