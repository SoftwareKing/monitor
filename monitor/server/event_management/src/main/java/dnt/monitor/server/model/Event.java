package dnt.monitor.server.model;

import net.happyonroad.model.Record;
import net.happyonroad.type.AckStatus;
import net.happyonroad.type.Priority;
import net.happyonroad.type.Severity;

/**
 * <h1>事件实体类</h1>
 * TODO add resource_type, resource_id，支持通过资源类型方式过滤事件
 */
public class Event extends Record
{
    private static final long serialVersionUID = -664781305450218915L;
    private String path; // 管理节点的路径

    private Severity severity; // 严重级别

    private String content; // 事件内容

    private Priority priority; // 优先级

    private AckStatus ack; // 事件状态

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public Priority getPriority() {
        return priority;
    }
    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public AckStatus getAck() {
        return ack;
    }
    public void setAck(AckStatus ack) {
        this.ack = ack;
    }
}
