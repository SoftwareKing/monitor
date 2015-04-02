/**
 * Developer: Kadvin Date: 15/3/10 上午9:10
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * <h1>指向资源节点的管理节点</h1>
 */
public class ResourceNode extends ManagedNode {
    private static final long serialVersionUID = 7032283528722261131L;
    // Resource 对象ID，执行两级关联时，以该字段为依据
    private Long     resourceId;
    // Resource 对象
    private Resource resource;

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
        if (this.resource != null) {
            this.resourceId = this.resource.getId();
        }
    }

    @JsonIgnore
    public boolean isEngineNode(){
        return "/application/monitor_engine".equals(getResource().getType());
    }

    @JsonIgnore
    public boolean isServerNode(){
        return "/application/monitor_server".equals(getResource().getType());
    }
}
