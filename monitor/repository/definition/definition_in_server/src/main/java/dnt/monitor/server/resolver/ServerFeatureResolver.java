/**
 * Developer: Kadvin Date: 14/12/27 下午9:20
 */
package dnt.monitor.server.resolver;

import dnt.monitor.meta.MetaResource;
import dnt.monitor.service.CategoryService;
import dnt.monitor.service.MetaService;
import dnt.monitor.server.service.ResourceService;
import dnt.monitor.server.util.CategoryConstants;
import net.happyonroad.component.container.feature.AbstractFeatureResolver;
import net.happyonroad.component.core.Component;
import net.happyonroad.platform.web.controller.ApplicationController;
import net.happyonroad.util.StringUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ScannedGenericBeanDefinition;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.type.classreading.CachingMetadataReaderFactory;
import org.springframework.core.type.classreading.MetadataReaderFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.core.annotation.AnnotationUtils.findAnnotation;

/**
 * <h2>监控服务器读取扩展模型信息</h2>
 * <p/>
 * 主要扩展内容有：
 * <p/>
 * <ol>
 * <li>资源模型扩展</li>
 * <li>资源模型管理类扩展</li>
 * </ol>
 * <p/>
 * 主要扩展原理是：
 * <pre>
 * 在Spring Application Context加载之后
 * 扫描指定的目录(dnt.monitor.model)找到扩展的资源模型
 * 找到对应资源的管理类
 * </pre>
 */
public class ServerFeatureResolver extends AbstractFeatureResolver implements CategoryConstants{
    public static final String FEATURE           = "monitor-server";
    public static final String SERVER_REPOSITORY = "Server-Repository";

    protected ResourcePatternResolver resourcePatternResolver;
    protected MetadataReaderFactory   metadataReaderFactory;
    protected Component               component;

    private List<ResourceService> resourceServices;

    protected CategoryService categoryService;
    protected MetaService     metaService;

    public ServerFeatureResolver() {
        //55: Model Feature Resolver 之后(30)，加载
        //65: Model Feature Resolver 之前(70) 之前卸载
        super(55, 65);
        resourceServices = new ArrayList<ResourceService>();
    }

    @Override
    public String getName() {
        return FEATURE;
    }

    @Override
    public boolean hasFeature(Component component) {
        return StringUtils.isNotBlank(component.getManifestAttribute(SERVER_REPOSITORY));
    }

    @Override
    public synchronized void resolve(Component component) throws Exception {
        this.component = component;
        try {
            this.resourcePatternResolver = component.getResourceLoader();
            this.metadataReaderFactory = new CachingMetadataReaderFactory(this.resourcePatternResolver);
            scanManagers(component.getApplication());

            for (String type : categoryService.getTypes()) {
                scanViewMetas(component.getApplication(), type);
                scanControllerMetas(component.getApplication(), type);
            }
            logger.info("The {} feature is resolved for {}", component, FEATURE);
        } finally {
            this.component = null;
        }
    }


    // 搜索本上下文中ResourceService的服务类
    void scanManagers(ApplicationContext application) {
        Map<String, ResourceService> resourceServices = application.getBeansOfType(ResourceService.class);
        if (!resourceServices.isEmpty())
            logger.trace("Scanned {} resource services: {}", resourceServices.size(),
                         StringUtils.join(resourceServices.keySet(), ","));
        this.resourceServices.addAll(resourceServices.values());
    }

    //为某个类型搜索相应的视图/控制器动作
    void scanViewMetas(ApplicationContext application, String type) {
        logger.debug("Scanning view resources for {}", type);
        String prefix = "resources" + typePathOf(type);
        if (!prefix.endsWith("/")) prefix = prefix + "/";
        String pathPrefix = "classpath?:frontend/src/" + prefix;
        String[] views = new String[]{"detail", "new", "edit", "list"};
        String[] types = new String[]{"jade", "html", "htm"};
        MetaResource metaResource = metaService.getMetaResource(type);
        for (String view : views) {
            for (String ext : types) {
                Resource resource = application.getResource(pathPrefix + view + "." + ext);
                if (resource != null && resource.exists()) {
                    //与 CategoryMeta.VIEW_XXX的值对应
                    metaResource.setProperty("view." + view, prefix + view + "." + ext);
                    break;
                }
            }
        }
    }

    // REFORM to be readable
    void scanControllerMetas(ApplicationContext application, String type) {
        String baseName = FilenameUtils.getBaseName(type);
        MetaResource metaResource = metaService.getMetaResource(type);
        if ("".equals(baseName)) baseName = "resource";
        String[] names = application.getBeanDefinitionNames();
        for (String name : names) {
            BeanDefinition definition = ((BeanDefinitionRegistry) application).getBeanDefinition(name);
            if (definition instanceof ScannedGenericBeanDefinition) {
                ScannedGenericBeanDefinition sgbd = (ScannedGenericBeanDefinition) definition;
                Class<?> beanClass;
                try {
                    beanClass = sgbd.resolveBeanClass(application.getClassLoader());
                } catch (ClassNotFoundException e) {
                    continue;
                }
                if (beanClass != null && ApplicationController.class.isAssignableFrom(beanClass)) {
                    RequestMapping klassMapping = findAnnotation(beanClass, RequestMapping.class);
                    if (klassMapping == null) continue;
                    String[] apiPrefixes = klassMapping.value();
                    for (String apiPrefix : apiPrefixes) {
                        if (apiPrefix.startsWith("/api/" + StringUtils.pluralize(baseName)) ||
                            apiPrefix.startsWith("/api/" + baseName)) {
                            Method[] methods = beanClass.getMethods();
                            for (Method method : methods) {
                                RequestMapping methodMapping = findAnnotation(method, RequestMapping.class);
                                if (methodMapping == null) continue;
                                RequestMethod requestMethod = methodMapping.method().length == 0 ?
                                                              RequestMethod.GET : methodMapping.method()[0];
                                //暂时不考虑对PUT/POST/DELETE等方法生成元信息，因为他们现在都是通过Node的API进行操作的
                                if (requestMethod != RequestMethod.GET) continue;
                                //根据方法映射为对应的元信息键名
                                String metaName = getMetaName(method);
                                //根据RequestMapping映射为对应的url(不带参数)
                                String url = getMetaValue(apiPrefix, methodMapping);
                                //找到所有的参数
                                List<String> params = getRequestParams(method);
                                //将url和参数表达连接起来
                                url = url + urlWithParams(params);
                                metaResource.setProperty(metaName, url );
                            }
                        }
                    }
                }
            }
        }
    }

    String getMetaName(Method method) {
        String propertyName;//返回的是资源类型，一般对应于 API_DETAIL2(show) / API_DETAIL(other method name)
        if (dnt.monitor.model.Resource.class.isAssignableFrom(method.getReturnType())) {
            if (method.getName().equals("show"))
                propertyName = API_DETAIL2;
            else
                propertyName = API_DETAIL;
        } else {
            //page, list 等其他类型，对应于API_LIST
            propertyName = API_LIST;
        }
        return propertyName;
    }

    String getMetaValue(String apiPrefix, RequestMapping methodMapping) {
        String property = apiPrefix;
        if (methodMapping.value().length > 0) {
            String apiSuffix = methodMapping.value()[0];
            if (apiPrefix.endsWith("/")) {
                if (apiSuffix.startsWith("/"))
                    property = apiPrefix + apiSuffix.substring(1);
                else
                    property = apiPrefix + apiSuffix;
            } else {
                if (apiSuffix.startsWith("/"))
                    property = apiPrefix + apiSuffix;
                else
                    property = apiPrefix + "/" + apiSuffix;
            }
        }
        return property;
    }

    List<String> getRequestParams(Method method ){
        List<String> requestParams = new ArrayList<String>();
        Annotation[][] annotations = method.getParameterAnnotations();
        for (Annotation[] annotation : annotations) {
            for (Annotation ann : annotation) {
                if (RequestParam.class.isInstance(ann)) {
                    RequestParam requestParam = (RequestParam) ann;
                    requestParams.add(requestParam.value());
                }
            }
        }
        // 现在先采用权宜之计 before/after filter representation
        if( method.getName().contains("index") ){
            requestParams.add("page");
            requestParams.add("count");
            requestParams.add("sort");
        }
        return requestParams;
    }

    String urlWithParams(List<String> params) {
        if (params == null || params.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        sb.append("?");
        for (String value : params) {
            sb.append(value).append("=")
              .append("{").append(value)
              .append("}").append("&");
        }
        sb.deleteCharAt(sb.length() - 1);
        return sb.toString();
    }


    String typePathOf(String type) {
        String[] segments = type.split("/");
        List<String> results = new ArrayList<String>();
        for (String segment : segments) {
            if ("".equals(segment)) continue;
            results.add(StringUtils.pluralize(segment));
        }
        return "/" + StringUtils.join(results, "/");
    }

    public List<ResourceService> getResourceServices() {
        return resourceServices;
    }


    public void setCategoryService(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    public void setMetaService(MetaService metaService) {
        this.metaService = metaService;
    }
}
