/**
 * Developer: Kadvin Date: 14-6-5 下午1:49
 */
package dnt.monitor.model;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;

/**
 * <h1>TCP连接表项</h1>
 * <pre>
 * 实际业务开发时，可能有这样的需求：
 * 需要对 localAddress = 0.0.0.0, localPort = 80 的tcp项的state做告警
 * state = listen(2) 为正常，closed(1)为错误，其他状态为警告
 * 此时，由于TcpEntry不是monitorable对象，无法做告警，只能基于其宿主(resource/component/link)+阀值参数做告警
 * 未来有可能将TcpEntry变为组件
 * </pre>
 */
@Table(value = "1.3.6.1.2.1.6.13", prefix = "tcpConn")
//localAddress localPort remAddress remPort
@Shell({
        @OS(type = "linux", command = @Command("netstat -tn --inet -a | tail -n+3")),
        /* TODO --inet 限制ipv4貌似不行，有许多服务用的就是ipv6的地址*/
        @OS(type = "aix"  , command = @Command("netstat -an | grep tcp | tail -n+3"), 
                mapping=@Mapping(value={"","","","Local","Foreign","State"})),
        @OS(type = "osx", command = @Command("netstat -n -f inet -p tcp | tail -n+3") )
})
@Mapping({"", "", "", "Local", "Foreign", "State"})
public class TcpEntry extends UdpEntry{
    private static final long serialVersionUID = -1104818168524698812L;
    @OID("RemAddress")
    @Shell({
            @OS(type = "linux", value = @Value(value = "Foreign", converter = "extractor", format = "([^:]+):[^:]+")),
            @OS(type = "aix"  , value = @Value(value = "Foreign", converter = "extractor"  , format = "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(?:\\d+|\\*)")),
            @OS(type = "osx"  , value = @Value(value = "Foreign", converter = "extractor"  , format = "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(?:\\d+|\\*)"))
    })
    private String remAddress;
    @OID("RemPort")
    @Shell({
            @OS(type = "linux", value = @Value(value = "Foreign", converter = "extractor", format = "[^:]+:([^:]+)")),
            @OS(type = "aix", value = @Value(value = "Foreign", converter = "extractor"  , format = "(?:\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(\\d+|\\*)")),
            @OS(type = "osx", value = @Value(value = "Foreign", converter = "extractor"  , format = "(?:\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(\\d+|\\*)"))
    })
    private String remPort;
    @OID("State")
    @Value("State")
    // snmp 取来的是int，ssh/bash取来的是string，snmp的还需要转换
    private String state;

    //因为取TCPConn的prefix = tcpConn，取来的数据也是 tcp表的数据，与udp表(prefix = udpLocal)不一样
    @OID("LocalAddress")
    @Override
    public void setLocalAddress(String localAddress) {
        super.setLocalAddress(localAddress);
    }

    @OID("LocalPort")
    @Override
    public void setLocalPort(String localPort) {
        super.setLocalPort(localPort);
    }

    public String getRemAddress() {
        return remAddress;
    }

    public void setRemAddress(String remAddress) {
        this.remAddress = remAddress;
    }

    public String getRemPort() {
        return remPort;
    }

    public void setRemPort(String remPort) {
        this.remPort = remPort;
    }


    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TcpEntry)) return false;

        TcpEntry tcpEntry = (TcpEntry) o;

        if (remPort != tcpEntry.remPort) return false;
        if (!state.equals(tcpEntry.state)) return false;
        if (remAddress != null ? !remAddress.equals(tcpEntry.remAddress) : tcpEntry.remAddress != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = remAddress != null ? remAddress.hashCode() : 0;
        result = 31 * result + remPort.hashCode();
        result = 31 * result + state.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "TcpEntry(" + localAddress + ':'  + localPort + " <-> " + remAddress + ':'  + remPort + " = " + state + ')';
    }
}
