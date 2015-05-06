package dnt.monitor.policy;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import net.happyonroad.type.Priority;
import net.happyonroad.type.Severity;

import java.io.Serializable;

/**
 * <h1>告警的定义</h1>
 *
 * @author Jay Xiong
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class AlarmPolicy implements Serializable{
    private static final long serialVersionUID = -7227861542651673649L;
    //告警名称
    private String title;
    //告警描述
    private String description;

    //是否产生
    private boolean enabled;

    //告警级别
    private Severity severity;
    //告警优先级/紧急程度
    private Priority priority;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}
