/**
 * Developer: Kadvin Date: 15/1/4 下午3:48
 */
package dnt.monitor.resolver;

import dnt.monitor.exception.MetaException;
import dnt.monitor.model.ManagedObject;
import dnt.monitor.service.MetaService;
import net.happyonroad.component.container.feature.AbstractFeatureResolver;
import net.happyonroad.component.core.Component;
import net.happyonroad.spring.support.ComponentResourcePatternResolver;
import net.happyonroad.util.StringUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.core.type.classreading.CachingMetadataReaderFactory;
import org.springframework.core.type.classreading.MetadataReader;
import org.springframework.core.type.classreading.MetadataReaderFactory;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;

import java.io.IOException;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

/**
 * Resolve the model feature
 */
public class ModelFeatureResolver extends AbstractFeatureResolver implements Comparator<Class>{
    public static final String FEATURE          = "monitor-model";
    public static final String MODEL_REPOSITORY = "Model-Repository";

    protected ResourcePatternResolver resourcePatternResolver;
    protected MetadataReaderFactory   metadataReaderFactory;
    // 当前解析的组件
    protected Component               component;

    private MetaService metaService;

    public ModelFeatureResolver() {
        super(50, 70);
    }

    @Override
    public String getName() {
        return FEATURE;
    }

    @Override
    public boolean hasFeature(Component component) {
        return StringUtils.isNotBlank(component.getManifestAttribute(MODEL_REPOSITORY));
    }

    @Override
    public void applyDefaults(Component component) {
        super.applyDefaults(component);
        String modelRepository = component.getManifestAttribute(MODEL_REPOSITORY);
        if (modelRepository == null && readComponentDefaultConfig(component, "M").contains("M")) {
            modelRepository = System.getProperty("default.model.repository", "dnt.monitor.model");
        }
        component.setManifestAttribute(MODEL_REPOSITORY, modelRepository);
    }

    @Override
    public void resolve(Component component) throws Exception {
        this.component = component;
        Assert.notNull(metaService, "The meta service is not registered!");
        try {
            String modelRepository = component.getManifestAttribute(MODEL_REPOSITORY);
            this.resourcePatternResolver = component.getResourceLoader();
            this.metadataReaderFactory = new CachingMetadataReaderFactory(this.resourcePatternResolver);
            scanModels(modelRepository);
            logger.info("The {} feature is resolved for {}", component, FEATURE);
        } finally {
            this.component = null;
        }

    }

    @SuppressWarnings("unchecked")
    @Override
    public int compare(Class o1, Class o2) {
        int i1 = orderOf(o1);
        int i2 = orderOf(o2);
        if( i1 == i2 ){
            if( o1.isAssignableFrom(o2) ){
                return -1;
            }else if( o2.isAssignableFrom(o1) ){
                return 1;
            }else {
                return 0;
            }
        }
        return i1 - i2;
    }

    private int orderOf(Class klass) {
        if(dnt.monitor.model.Resource.class.isAssignableFrom(klass))
            return 10;
        if(dnt.monitor.model.Link.class.isAssignableFrom(klass))
            return 20;
        if(dnt.monitor.model.Component.class.isAssignableFrom(klass))
            return 30;
        return 0;
    }


    void scanModels(String basePackage) throws IOException {
        String packageSearchPath = ComponentResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX +
                                   resolveBasePackage(basePackage) + "/**/*.class";
        Resource[] resources = resourcePatternResolver.getResources(packageSearchPath);
        List<Class> classes = new LinkedList<Class>();
        for (Resource resource : resources) {
            logger.trace("Scanning {}", resource);
            if (!resource.isReadable()) continue;
            MetadataReader reader = metadataReaderFactory.getMetadataReader(resource);
            AnnotationMetadata amd = reader.getAnnotationMetadata();
            Class klass = introspectedClass(amd);
            if (!isCandidateModelClass(klass)) continue;
            logger.trace("Identified candidate: {}", resource.getFilename());
            classes.add(klass);
        }
        Collections.sort(classes,this);
        for (Class klass : classes) {
            try {
                metaService.resolve(klass);
            } catch (MetaException e) {
                // 系统需要兼容开发得有问题的模型
                // 所以不能让某个模型解析不成功导致系统无法启动
                logger.error("Can't resolve meta mode of " + klass.getName(), e);
            }
        }
    }

    /**
     * Judge the class meta data is represents any managed object model?
     *
     * @param klass the model class to be judged
     * @return is any managed object model
     */
    boolean isCandidateModelClass(Class klass) {
        return ManagedObject.class.isAssignableFrom(klass);
    }

    String resolveBasePackage(String basePackage) {
        return ClassUtils.convertClassNameToResourcePath(basePackage);

    }

    Class introspectedClass(AnnotationMetadata amd) {
        try {
            return Class.forName(amd.getClassName(), false, component.getClassLoader());
        } catch (Exception ex) {
            throw new IllegalStateException("Can't find class " + amd.getClassName() + " by " + component, ex);
        }
    }

    public void setMetaService(MetaService metaService) {
        this.metaService = metaService;
    }
}
