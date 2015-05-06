/**
 * Developer: Kadvin Date: 14-6-5 下午1:53
 */
package dnt.monitor.model;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;

/**
 * UDP表项
 * <ul>
 * <li>localAddress: UDP绑定的本地地址</li>
 * <li>localPort: UDP绑定的本地端口</li>
 * </ul>
 */
@Table(value = "1.3.6.1.2.1.7.5", prefix = "udpLocal")
@Shell({
        @OS(type = "linux", command = @Command("netstat -un --inet -a | tail -n+3")),
        @OS(type = "aix"  , command = @Command("netstat -an | grep udp | tail -n+3")),
        @OS(type = "osx", command = @Command("netstat -n -f inet -p udp | tail -n+3"))
})
@Mapping({"", "", "", "Local", "Foreign", "State"})
public class UdpEntry extends Entry {
    private static final long serialVersionUID = 7218057422899410755L;
    @OID("Address")
    @Shell({
            @OS(type = "linux", value = @Value(value = "Local", converter = "extractor", format = "([^:]+):[^:]+")),
            @OS(type = "aix"  , value = @Value(value = "Local", converter = "extractor", format = "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(?:\\d+|\\*)")),
            @OS(type = "osx"  , value = @Value(value = "Local", converter = "extractor",
                    format = "(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(?:\\d+|\\*)"))
    })
    protected String localAddress;
    @OID("Port")
    @Shell({
            @OS(type = "linux", value = @Value(value = "Local", converter = "extractor", format = "[^:]+:([^:]+)")),
            @OS(type = "aix", value = @Value(value = "Local", converter = "extractor",   format = "(?:\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(\\d+|\\*)")),
            @OS(type = "osx", value = @Value(value = "Local", converter = "extractor",
                    format = "(?:\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\*)\\.(\\d+|\\*)"))
    })
    protected String localPort;

    public String getLocalAddress() {
        return localAddress;
    }

    public void setLocalAddress(String localAddress) {
        this.localAddress = localAddress;
    }

    public String getLocalPort() {
        return localPort;
    }

    public void setLocalPort(String localPort) {
        this.localPort = localPort;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UdpEntry)) return false;

        UdpEntry udpEntry = (UdpEntry) o;

        if (localPort != udpEntry.localPort) return false;
        if (localAddress != null ? !localAddress.equals(udpEntry.localAddress) : udpEntry.localAddress != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = localAddress != null ? localAddress.hashCode() : 0;
        result = 31 * result + localPort.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "UdpEntry(" + localAddress + ':' + localPort + ')';
    }
}
