package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.annotation.jmx.ObjectAttr;
import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.framework.Component;
import dnt.monitor.model.meta.MetaComponentEntry;
import dnt.monitor.model.meta.MetaEntryEntry;
import dnt.monitor.model.meta.MetaLinkEntry;
import dnt.monitor.model.meta.MetaResourceEntry;

import java.util.Properties;

/**
 * <h1>监控服务器通用模型</h1>
 * <p/>
 * <ul>
 * <li> Monitor Server
 * <li> Monitor Engine
 * <li> Monitor Agent
 * </ul>
 * TODO jmx采集之外，Server与Engine还需要将其config文件加载作为properties
 * 这个properties也是需要通过jmx暴露
 * @author Jay Xiong
 */
@Category("monitor")
public abstract class MonitorApplication extends JvmApplication {
    private static final long serialVersionUID = 5629564504832650447L;

    //作为组件框架
    @Keyed
    private dnt.monitor.model.framework.Component[] components;

    //作为资源包容器

    @Keyed
    private MetaResourceEntry[] metaResources;

    @Keyed
    private MetaComponentEntry[] metaComponents;

    @Keyed
    private MetaLinkEntry[] metaLinks;

    @Keyed
    private MetaEntryEntry[] metaEntries;


    public Component[] getComponents() {
        return components;
    }

    public void setComponents(Component[] components) {
        this.components = components;
    }

    public MetaResourceEntry[] getMetaResources() {
        return metaResources;
    }

    public void setMetaResources(MetaResourceEntry[] metaResources) {
        this.metaResources = metaResources;
    }

    public MetaComponentEntry[] getMetaComponents() {
        return metaComponents;
    }

    public void setMetaComponents(MetaComponentEntry[] metaComponents) {
        this.metaComponents = metaComponents;
    }

    public MetaLinkEntry[] getMetaLinks() {
        return metaLinks;
    }

    public void setMetaLinks(MetaLinkEntry[] metaLinks) {
        this.metaLinks = metaLinks;
    }

    public MetaEntryEntry[] getMetaEntries() {
        return metaEntries;
    }

    public void setMetaEntries(MetaEntryEntry[] metaEntries) {
        this.metaEntries = metaEntries;
    }

    @ObjectName("net.happyonroad:type=service,name=configProperties")
    @ObjectAttr("Properties")
    @Keyed
    @Indicator
    @Override
    public void setProperties(Properties properties) {
        super.setProperties(properties);
    }
}
