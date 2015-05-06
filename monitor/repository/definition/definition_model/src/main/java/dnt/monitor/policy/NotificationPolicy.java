package dnt.monitor.policy;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * <h1>通知的定义</h1>
 *
 * @author Jay Xiong
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class NotificationPolicy implements Serializable{

    private static final long serialVersionUID = 8925433633301971004L;

    //是否进行通知
    private boolean enabled;

    //通知策略名称
    private String title;
    //备注
    private String comment;

    //通知方式， 通过字符与系统实际的通知方式对应
    private Set<String> methods;
    //接收人员， TODO 暂时以字符串代表实际接受者
    private Set<String> receivers;
    //若干小时内，需要执行相应通知时，仅进行一次通知；TODO 如何定义，解释limitation
    private String limitation;
    //需要发出该通知的告警，或关系；满足alarm的所有情况都要一起遵循limitation
    private List<String> alarms;
    //通知的时间窗口，在时间窗口之外，通知挂住不进行发送；进入窗口再进行发生
    // TODO 定义和解析时间窗口的格式
    private String window;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Set<String> getMethods() {
        return methods;
    }

    public void setMethods(Set<String> methods) {
        this.methods = methods;
    }

    public Set<String> getReceivers() {
        return receivers;
    }

    public void setReceivers(Set<String> receivers) {
        this.receivers = receivers;
    }

    public String getLimitation() {
        return limitation;
    }

    public void setLimitation(String limitation) {
        this.limitation = limitation;
    }

    public List<String> getAlarms() {
        return alarms;
    }

    public void setAlarms(List<String> alarms) {
        this.alarms = alarms;
    }

    public String getWindow() {
        return window;
    }

    public void setWindow(String window) {
        this.window = window;
    }
}
