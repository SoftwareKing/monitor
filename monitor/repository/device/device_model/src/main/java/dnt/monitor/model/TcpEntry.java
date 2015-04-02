/**
 * Developer: Kadvin Date: 14-6-5 下午1:49
 */
package dnt.monitor.model;

import dnt.monitor.annotation.snmp.Group;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;

/**
 * 通过SNMP获得的TCP连接表项
 * <ul>
 * <li>localAddress: 本地地址</li>
 * <li>localPort: 本地端口</li>
 * <li>remAddress: 远端地址</li>
 * <li>remPort: 远端地址</li>
 * </ul>
 * TODO
 * <pre>
 * 实际业务开发时，可能有这样的需求：
 * 需要对 localAddress = 0.0.0.0, localPort = 80 的tcp项的state做告警
 * state = listen(2) 为正常，closed(1)为错误，其他状态为警告
 * 此时，由于TcpEntry不是monitorable对象，无法做告警，只能基于其宿主(resource/component/link)+阀值参数做告警
 * 未来有可能将TcpEntry变为组件
 * </pre>
 */
@Table(value = "1.3.6.1.2.1.6.13", prefix = "tcpConn")
public class TcpEntry extends UdpEntry{
    private static final long serialVersionUID = -1104818168524698812L;
    @OID("RemAddress")
    private String remAddress;
    @OID("RemPort")
    private int remPort;
    @OID("State")
    private int state;


    public String getRemAddress() {
        return remAddress;
    }

    public void setRemAddress(String remAddress) {
        this.remAddress = remAddress;
    }

    public int getRemPort() {
        return remPort;
    }

    public void setRemPort(int remPort) {
        this.remPort = remPort;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TcpEntry)) return false;

        TcpEntry tcpEntry = (TcpEntry) o;

        if (remPort != tcpEntry.remPort) return false;
        if (state != tcpEntry.state) return false;
        if (remAddress != null ? !remAddress.equals(tcpEntry.remAddress) : tcpEntry.remAddress != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = remAddress != null ? remAddress.hashCode() : 0;
        result = 31 * result + remPort;
        result = 31 * result + state;
        return result;
    }

    @Override
    public String toString() {
        return "TcpEntry(" + localAddress + ':'  + localPort + " <-> " + remAddress + ':'  + remPort+ ')';
    }
}
