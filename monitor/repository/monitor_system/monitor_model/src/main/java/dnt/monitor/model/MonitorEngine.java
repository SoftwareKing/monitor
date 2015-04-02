/**
 * Developer: Kadvin Date: 14/12/23 下午4:36
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Config;

/**
 * Monitor Engine
 */
@Category("monitor_engine")
public class MonitorEngine extends Application {
    private static final long serialVersionUID = -7931606698205633725L;

    public MonitorEngine() {
        // 这个很怪异
        this.setType("/application/monitor_engine");
    }

    @Config
    private String name;
    @Config
    private String engineId;
    @Config
    private String apiToken;

    private ApproveStatus approveStatus = ApproveStatus.Requested;

    @Config
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEngineId() {
        return engineId;
    }

    public void setEngineId(String engineId) {
        this.engineId = engineId;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }

    public ApproveStatus getApproveStatus() {
        return approveStatus;
    }

    public void setApproveStatus(ApproveStatus approveStatus) {
        this.approveStatus = approveStatus;
    }

    /**
     * <h2>判断是否是缺省引擎</h2>
     * 当下的判断依据是 properties 里面 default = true
     * @return 是否是缺省引擎
     */
    @JsonIgnore
    public boolean isDefault() {
        return getName().equals("default");
    }

    @JsonIgnore
    public String getScopePath(){
        return ManagedNode.ROOT_PATH + getName();
    }

    @JsonIgnore
    public String getSystemPath(){
        return ManagedNode.INFRASTRUCTURE_PATH + "/" + getName();
    }

    @JsonIgnore
    public boolean isRequesting() {
        return getApproveStatus() == ApproveStatus.Requested;
    }

    @JsonIgnore
    public boolean isRejected() {
        return getApproveStatus() == ApproveStatus.Rejected;
    }

    @JsonIgnore
    public boolean isApproved() {
        return getApproveStatus() == ApproveStatus.Approved;
    }
}
