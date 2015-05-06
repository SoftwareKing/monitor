package dnt.monitor.policy;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;
import java.util.List;

/**
 * <h1>动作的定义</h1>
 *
 * @author Jay Xiong
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class ActionPolicy implements Serializable{
    private static final long serialVersionUID = 3768665195231495476L;

    //是否进行动作
    private boolean      enabled;
    //策略名称
    private String       title;
    //备注
    private String       comment;
    //需要执行该动作的告警
    private List<String> alarms;
    //实际执行的动作，包括:
    //  Ssh | Telnet | Local | Windows Command
    //  API invoker
    //  HTTP invoker
    //  System Action
    //  ...
    private Execution execution;

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

    public List<String> getAlarms() {
        return alarms;
    }

    public void setAlarms(List<String> alarms) {
        this.alarms = alarms;
    }

    public Execution getExecution() {
        return execution;
    }

    public void setExecution(Execution execution) {
        this.execution = execution;
    }
}
