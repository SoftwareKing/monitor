package dnt.monitor.support.resolver;

import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.sampling.MetaRoot;
import dnt.monitor.model.Resource;
import dnt.monitor.service.MetaFieldResolverHelper;
import dnt.monitor.service.MetaModelResolverHelper;
import dnt.monitor.service.MetaRelationResolverHelper;
import dnt.monitor.support.resolver.MetaResolverHelper;
import net.happyonroad.util.StringUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SystemUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.ResourceUtils;

import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public abstract class DefaultMetaResolverHelper<T extends MetaRoot> extends MetaResolverHelper implements
                                                                                               MetaRelationResolverHelper,
                                                                                               MetaFieldResolverHelper,
                                                                                               MetaModelResolverHelper {

    protected abstract T resolveFromField(PropertyDescriptor descriptor, Field field);

    protected abstract T resolveFromModel(Class clazz);

    @Override
    public void resolveRelation(PropertyDescriptor descriptor, Field field, MetaRelation metaRelation) {
        T metaRoot = resolveFromField(descriptor, field);
        if (isNotEmpty(metaRoot)) {
            metaRelation.setAttribute((Class) metaRoot.getClass(), metaRoot);
        }
    }

    @Override
    public void resolveField(PropertyDescriptor descriptor, Field field, MetaField metaField) {
        T metaRoot = resolveFromField(descriptor, field);
        if (isNotEmpty(metaRoot)) {
            metaField.setAttribute((Class) metaRoot.getClass(), metaRoot);
        }
    }

    @Override
    public void resolveModel(Class clazz, MetaModel metaModel) {
        if (Resource.class.isAssignableFrom(clazz)) {  //对于Resource存在继承
            Class processing = clazz;
            List<Class> processClasses = new ArrayList<Class>();
            while (processing != Resource.class) {
                processClasses.add(processing);
                processing = processing.getSuperclass();
            }
            //需要从父类向子类写
            Collections.reverse(processClasses);
            List<T> metaRootList = new ArrayList<T>();
            for (Class c : processClasses) {
                T metaRoot = resolveFromModel(c);
                if (isNotEmpty(metaRoot)) {
                    metaRootList.add(metaRoot);
                }
            }
            if (metaRootList.size() > 0) {
                @SuppressWarnings("unchecked")
                T[] metaRootArray = metaRootList
                        .toArray((T[]) Array.newInstance(metaRootList.get(0).getClass(), metaRootList.size()));
                metaModel.setAttribute((Class) metaRootArray.getClass(), metaRootArray);
            }
        } else {
            T metaRoot = resolveFromModel(clazz);
            if (isNotEmpty(metaRoot)) {
                metaModel.setAttribute((Class) metaRoot.getClass(), metaRoot);
            }
        }
    }

    protected String actualContent(Class clazz, String rawValue) {
        if(StringUtils.isBlank(rawValue)){
            return null;
        }
        String value;
        if (rawValue.startsWith(ResourceUtils.CLASSPATH_URL_PREFIX)) {
            String path = rawValue.substring(ResourceUtils.CLASSPATH_URL_PREFIX.length());
            InputStream stream;
            try {
                if (path.startsWith("./")) {//relative path
                    path = clazz.getPackage().getName().replaceAll("\\.", "/") + path.substring(1);
                }
                stream = new ClassPathResource(path, clazz.getClassLoader()).getInputStream();
                List<String> strings = IOUtils.readLines(stream);
                value = StringUtils.join(strings, SystemUtils.LINE_SEPARATOR);
            } catch (IOException e) {
                throw new IllegalStateException("Can't convert " + rawValue, e);
            }
        } else {
            value = rawValue;
        }
        return value;
    }

    protected boolean isNotEmpty(MetaRoot metaRoot) {
        return metaRoot != null && metaRoot.getOsList() != null && metaRoot.getOsList().size() > 0;
    }
}
