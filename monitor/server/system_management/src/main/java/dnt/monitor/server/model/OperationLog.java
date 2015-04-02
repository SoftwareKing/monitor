package dnt.monitor.server.model;

import net.happyonroad.model.Record;
import net.happyonroad.type.Severity;

/**
 * 操作日志记录
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

public class OperationLog extends Record {

    private static final long serialVersionUID = -1179570115157740717L;
    // 管理节点的路径
    private String   path;
    // 日志级别
    private Severity severity;
    // 日志内容
    private String   content;

    // 操作人编号
    private Long userId;

    // 操作人姓名
    private String userName;

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

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }

    public void setUserName(String userName) { this.userName = userName; }
}
