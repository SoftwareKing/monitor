/**
 * Developer: Kadvin Date: 14/12/24 下午2:47
 */
package dnt.monitor.server.model;

import net.happyonroad.model.Record;
import net.happyonroad.type.Severity;

/**
 * 监控日志记录
 */
public class MonitorLog extends Record {

    private static final long serialVersionUID = 1824083884300650890L;
    // 管理节点的路径
    private String   path;
    // 日志级别
    private Severity severity;
    // 日志内容
    private String   content;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
