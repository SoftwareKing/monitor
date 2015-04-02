/**
 * Developer: Kadvin Date: 14/12/22 上午10:26
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import dnt.monitor.annotation.Inheriting;
import net.happyonroad.model.Category;
import net.happyonroad.model.Credential;
import net.happyonroad.model.PropertiesSupportRecord;
import net.happyonroad.type.*;
import net.happyonroad.util.StringUtils;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * 管理节点对象
 */
@JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class ManagedNode extends PropertiesSupportRecord {
    public static final String ROOT_PATH           = "/";
    public static final String INFRASTRUCTURE_PATH = "/infrastructure";
    private static final long serialVersionUID = 1861250126041241051L;
    //TODO add Pattern validation for the path
    // 管理节点的路径，新增对象的path为空，需要管理层设置
    private String path;
    // 深度，数据库冗余字段（与path冗余）
    @JsonIgnore
    private int    depth;
    @NotNull
    // 显示名称
    private String label;
    // 使用图标
    private String icon;
    // 管理员备注信息
    private String comment;
    // 内部状态属性

    ////////////////////////////////////////
    // 可继承的属性
    ////////////////////////////////////////
    // 监控控制
    @Inheriting
    private State    state;
    // 地理位置
    @Inheriting
    private Location location;
    // 优先级
    @Inheriting
    private Priority priority;
    // 维护时间窗：在该时间段内产生的事件不发出告警
    @Inheriting
    private TimeSpan maintainWindow;
    // 监控计划，start -> stop, frequency, offset
    @Inheriting
    private Schedule schedule;
    // 登录凭据
    @Inheriting
    Credential[] credentials;
    // 组织机构
    @Inheriting
    private String organization;

    ////////////////////////////////////////
    // 其他相关属性
    ////////////////////////////////////////

    // 事件汇总信息
    private Map<Severity, Integer> summary;

    public String getPath() {
        return path;
    }

    @JsonIgnore
    public String getParentPath(){
        return Category.parentOf(path);
    }

    public void setPath(String path) {
        this.path = path;
        if (StringUtils.isNotBlank(this.path)) {
            setDepth(net.happyonroad.model.Category.depth(this.path));
        }
    }

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setSummary(Map<Severity, Integer> summary) {
        this.summary = summary;
    }

    public Map<Severity, Integer> getSummary() {
        return summary;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Location getLocation() {
        return location;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public TimeSpan getMaintainWindow() {
        return maintainWindow;
    }

    public void setMaintainWindow(TimeSpan maintainWindow) {
        this.maintainWindow = maintainWindow;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public Credential[] getCredentials() {
        return credentials;
    }

    public void setCredentials(Credential... credentials) {
        this.credentials = credentials;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ManagedNode)) return false;
        if (!super.equals(o)) return false;

        ManagedNode that = (ManagedNode) o;

        //noinspection RedundantIfStatement
        if (path != null ? !path.equals(that.path) : that.path != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (path != null ? path.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return reduceCglibName(getClass().getSimpleName()) + "(" + path + ")";
    }

    ////////////////////////////////////////
    // 业务支持方法
    ////////////////////////////////////////

    /**
     * 与另外的节点进行合并
     *
     * @param another 被合并的节点，要求该节点已经与其父节点进行过合并
     */
    public void merge(ManagedNode another) {
        if (another.getState() != null && this.state == null)
            setState(another.getState());
        if (another.getLocation() != null && this.location == null)
            setLocation(another.getLocation());
        if (another.getPriority() != null && this.priority == null)
            setPriority(another.getPriority());
        if (another.getMaintainWindow() != null && this.maintainWindow == null)
            setMaintainWindow(another.getMaintainWindow());
        if (another.getSchedule() != null && this.schedule == null)
            setSchedule(another.getSchedule());
        if (another.getOrganization() != null && this.organization == null)
            setOrganization(another.getOrganization());
        if( another.getCredentials() != null ){
            if( credentials == null ){
                this.credentials = another.getCredentials();
            }else{
                List<Credential> credentialList = new ArrayList<Credential>();
                Collections.addAll(credentialList, credentials);
                for (Credential credential : another.getCredentials()) {
                    boolean found = false;
                    for (Credential exist: credentialList) {
                        if( exist.getClass() == credential.getClass())
                            found = true;
                    }
                    if( !found){
                        credentialList.add(credential);
                    }
                }
                this.credentials = credentialList.toArray(new Credential[credentialList.size()]);
            }
        }
        // others
    }

    @JsonIgnore
    public boolean isRoot() {
        return ROOT_PATH.equals(getPath());
    }

    @JsonIgnore
    public boolean isInfrastructure() {
        return INFRASTRUCTURE_PATH.equals(getPath());
    }

    @JsonIgnore
    public boolean isScope() {
        return !getPath().startsWith(INFRASTRUCTURE_PATH + "/") &&
               net.happyonroad.model.Category.depth(getPath()) == 1;
    }

    @JsonIgnore
    public boolean isSystem() {
        return getPath().startsWith(INFRASTRUCTURE_PATH + "/") &&
               net.happyonroad.model.Category.depth(getPath()) == 2;
    }

    public <T extends Credential> T getCredential(Class<T> credentialClass) {
        if( credentials == null ) return null;
        for (Credential credential : credentials) {
            if( credentialClass.isAssignableFrom(credential.getClass()) )
                //noinspection unchecked
                return (T) credential;
        }
        return null;
    }
}
