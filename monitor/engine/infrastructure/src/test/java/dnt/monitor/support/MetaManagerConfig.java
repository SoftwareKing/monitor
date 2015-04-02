package dnt.monitor.support;

import net.happyonroad.component.container.ComponentLoader;
import net.happyonroad.component.container.ComponentRepository;
import net.happyonroad.component.core.Component;
import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.component.core.FeatureResolver;
import net.happyonroad.spring.service.ServiceRegistry;
import net.happyonroad.spring.support.DefaultServiceHelper;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
@Configuration
@ComponentScan("dnt.monitor.support")
public class MetaManagerConfig {
    @Bean
    ComponentLoader componentLoader() {
        return new ComponentLoader() {
            @Override
            public boolean isLoaded(Component component) {
                return false;
            }

            @Override
            public void load(Component component) throws Exception {

            }

            @Override
            public void unload(Component component) {

            }

            @Override
            public void quickLoad(Component component) throws Exception {

            }

            @Override
            public void quickUnload(Component component) {

            }

            @Override
            public void registerResolver(FeatureResolver featureResolver) {

            }

            @Override
            public <T extends FeatureResolver> T getFeatureResolver(String s) {
                return null;
            }
        };
    }

    @Bean
    ComponentContext componentContext() {
        return new ComponentContext() {
            @Override
            public void registerFeature(Component component, String s, Object o) {

            }

            @Override
            public Object removeFeature(Component component, String s) {
                return null;
            }

            @Override
            public <T> T getFeature(Component component, String s) {
                return null;
            }

            @Override
            public ClassLoader getLibraryFeature(Component component) {
                return null;
            }

            @Override
            public ApplicationContext getApplicationFeature(Component component) {
                return null;
            }

            @Override
            public List<ApplicationContext> getApplicationFeatures() {
                return null;
            }

            @Override
            public ServiceRegistry getRegistry() {
                return null;
            }

            @Override
            public DefaultServiceHelper getServiceHelper() {
                return null;
            }

            @Override
            public ComponentLoader getComponentLoader() {
                return null;
            }

            @Override
            public ComponentRepository getComponentRepository() {
                return null;
            }

            @Override
            public ApplicationContext getRootContext() {
                return null;
            }
        };
    }
}
