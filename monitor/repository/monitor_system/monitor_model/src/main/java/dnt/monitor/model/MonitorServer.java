/**
 * Developer: Kadvin Date: 14/12/23 下午4:36
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.annotation.jmx.ObjectAttr;
import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.server.NodeStats;
import dnt.monitor.model.server.ServiceStats;

import java.util.Map;
import java.util.Properties;

/**
 * Monitor Server
 */
@Category("server")
public class MonitorServer extends MonitorApplication{
    private static final long serialVersionUID = 1894630831460403119L;

    public MonitorServer() {
        setType("/app/jvm/monitor/server");
    }

    @ObjectName("dnt.monitor.server:type=service,name=eventService")
    @ObjectAttr("EventSize")
    @Keyed
    @Indicator
    private Properties        eventSizes;
    @Keyed
    private NodeStats         nodeStats;
    @Keyed
    private ServiceStats      serviceStats;
    @Keyed
    @ObjectName("dnt.monitor.server:type=extension,name=*")
    @ObjectAttr("Size")
    @Indicator
    private Map<String, Long> resourceSizes;

    public Properties getEventSizes() {
        return eventSizes;
    }

    public void setEventSizes(Properties eventSizes) {
        this.eventSizes = eventSizes;
    }

    public NodeStats getNodeStats() {
        return nodeStats;
    }

    public void setNodeStats(NodeStats nodeStats) {
        this.nodeStats = nodeStats;
    }

    public ServiceStats getServiceStats() {
        return serviceStats;
    }

    public void setServiceStats(ServiceStats serviceStats) {
        this.serviceStats = serviceStats;
    }

    public Map<String, Long> getResourceSizes() {
        return resourceSizes;
    }

    public void setResourceSizes(Map<String, Long> resourceSizes) {
        this.resourceSizes = resourceSizes;
    }
}
