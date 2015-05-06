package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.snmp.MibRepository;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.extension.GlobalClassLoader;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.spring.service.ServiceRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

/**
 * <h1>The shared mib scanner</h1>
 *
 * @author Jay Xiong
 */
@ManagedResource(objectName = "dnt.monitor.engine:type=service,name=mibScanner")
@Component
public class MibScanner extends ApplicationSupportBean implements ApplicationListener<SystemStartedEvent> {
    @Autowired // for local auto-wired
    private MibRepository repository;
    @Autowired
    ServiceRegistry serviceRegistry;

    private String name;
    private String   preLoad = "classpath*:mibs/**";
    private String[] load    = new String[]{"*"};
    private Logger   logger  = LoggerFactory.getLogger(getClass());

    public void setName(String name) {
        this.name = name;
    }

    @ManagedAttribute
    public String getName() {
        return name;
    }

    public void setPreLoad(String preLoad) {
        this.preLoad = preLoad;
    }

    @ManagedAttribute
    public String getPreLoad() {
        return preLoad;
    }

    public void setLoad(String... load) {
        this.load = load;
    }

    @ManagedAttribute
    public String[] getLoad() {
        return load;
    }

    // after system started

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        Resource[] resources;
        try {
            ClassLoader cl = serviceRegistry.getService(GlobalClassLoader.class);
            PathMatchingResourcePatternResolver loader = new PathMatchingResourcePatternResolver(cl);
            resources = loader.getResources(getPreLoad());
            if (resources != null) repository.preLoad(resources);
        } catch (Exception ex) {
            logger.error("{} can't find pre loading resources {}, {}", getName(), getPreLoad(), ex.getMessage());
            return;
        }
        List<String> modules = new LinkedList<String>();
        for (String originPattern : getLoad()) {
            Pattern modulePattern = compile(originPattern);
            String[] array = filter(resources, modulePattern);
            List<String> strings = Arrays.asList(array);
            modules.addAll(strings);
        }
        repository.load(modules.toArray(new String[modules.size()]));
    }

    // @see JarResource#compileResourcePattern(String)
    // @see DefaultMessageBus#compile(String)
    private Pattern compile(String load) {
        String path = load.replace("**", "\\w{star}");
        path = path.replace("*", "[^\\/]*");
        path = path.replace("?", "[^\\/]");
        path = path.replace("{star}", "*");
        return Pattern.compile(path);
    }

    private String[] filter(Resource[] resources, Pattern pattern) {
        Collection<String> founds = new HashSet<String>();
        for (Resource resource : resources) {
            String filename = resource.getFilename();
            if (pattern.matcher(filename).find()) {
                long length;
                try {
                    length = resource.contentLength();
                } catch (IOException e) {
                    length = 0;
                }
                if (length > 0) {
                    founds.add(filename);
                }
            }
        }
        return founds.toArray(new String[founds.size()]);
    }

    @Override
    public String toString() {
        return "MibScanner(" + name + ')';
    }
}
