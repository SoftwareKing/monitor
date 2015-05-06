/**
 * Developer: Kadvin Date: 14/12/23 下午4:36
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.annotation.jmx.ObjectAttr;
import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.engine.ExecutorEntry;
import dnt.monitor.model.engine.MonitoringStats;

import java.util.Map;

/**
 * <h1>Monitor Engine</h1>
 * 执行无代理监控的统一监控引擎
 */
@Category("engine")
public class MonitorEngine extends MonitorApplication {
    private static final long serialVersionUID = -7931606698205633725L;

    public MonitorEngine() {
        // 这个很怪异
        this.setType("/app/jvm/monitor/engine");
    }

    @Config
    private String name;
    @Config
    private String engineId;
    @Config
    private String apiToken;

    private ApproveStatus approveStatus = ApproveStatus.Requested;

    @Keyed
    @ObjectName("dnt.monitor.engine:type=store,name=*")
    @ObjectAttr("Size")
    @Indicator
    private Map<String, Long> storeSizes;

    @Keyed
    //监控控制器
    private MonitoringStats monitoringStats;

    @Keyed
    //监控任务列表
    private ExecutorEntry[] executors;

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
     *
     * @return 是否是缺省引擎
     */
    @JsonIgnore
    public boolean isDefault() {
        return "default".equals(getName());
    }

    @JsonIgnore
    public String getScopePath() {
        return ManagedNode.ROOT_PATH + getName();
    }

    @JsonIgnore
    public String getSystemPath() {
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

    public Map<String, Long> getStoreSizes() {
        return storeSizes;
    }

    public void setStoreSizes(Map<String, Long> storeSizes) {
        this.storeSizes = storeSizes;
    }

    public MonitoringStats getMonitoringStats() {
        return monitoringStats;
    }

    public void setMonitoringStats(MonitoringStats monitoringStats) {
        this.monitoringStats = monitoringStats;
    }

    public ExecutorEntry[] getExecutors() {
        return executors;
    }

    public void setExecutors(ExecutorEntry[] executors) {
        this.executors = executors;
    }

    public static boolean isApproving(MonitorEngine oldEngine, MonitorEngine newEngine) {
        return (oldEngine.isRequesting()) && (newEngine.isApproved());

    }

    public static boolean isRejecting(MonitorEngine oldEngine, MonitorEngine newEngine) {
        return (oldEngine.isRequesting())
                && (newEngine.isRejected());

    }
}
