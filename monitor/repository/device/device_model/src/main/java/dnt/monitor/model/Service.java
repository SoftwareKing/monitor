/**
 * Developer: Kadvin Date: 15/2/15 下午6:37
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;

/**
 * <h1>主机上的ip服务</h1>
 */
@Anchor("port")
public class Service extends Component<Device> {
    private static final long serialVersionUID = 6895373633255098509L;
    private int port;
    private String protocol;

    public Service() {
    }

    public Service(String name, String protocol, int port) {
        setLabel(name);
        this.protocol = protocol;
        this.port = port;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    @Override
    public String toString() {
        if( getLabel() != null ) return getLabel();
        return protocol == null ? String.valueOf(port) : port + "/" + protocol;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Service)) return false;
        if (!super.equals(o)) return false;

        Service service = (Service) o;

        if (port != service.port) return false;
        if (protocol != null ? !protocol.equals(service.protocol) : service.protocol != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + port;
        result = 31 * result + (protocol != null ? protocol.hashCode() : 0);
        return result;
    }
}
