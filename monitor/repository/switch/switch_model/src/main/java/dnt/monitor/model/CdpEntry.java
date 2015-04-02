package dnt.monitor.model;

import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;

import java.util.Properties;

/**
 * <h1>Cisco Discovery Protocol Entry</h1>
 *
 * @author Jay Xiong
 */
@Table(value = "1.3.6.1.4.1.9.9.23.1.2.1", prefix = "cdpCache")
public class CdpEntry extends Entry {
    private static final long serialVersionUID = 4194373750636645109L;
    @OID("Address")
    private String address;
    @OID("AddressType")
    private int addressType;
    @OID("Version")
    private String version;
    @OID("DeviceId")
    private String deviceId;
    @OID("DevicePort")
    private String devicePort;
    @OID("Platform")
    private String platform;
    @OID("Capabilities")
    private String capabilities;
    @OID("NativeVLAN")
    private int nativeVLAN;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getAddressType() {
        return addressType;
    }

    public void setAddressType(int addressType) {
        this.addressType = addressType;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getDevicePort() {
        return devicePort;
    }

    public void setDevicePort(String devicePort) {
        this.devicePort = devicePort;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getCapabilities() {
        return capabilities;
    }

    public void setCapabilities(String capabilities) {
        this.capabilities = capabilities;
    }

    public int getNativeVLAN() {
        return nativeVLAN;
    }

    public void setNativeVLAN(int nativeVLAN) {
        this.nativeVLAN = nativeVLAN;
    }

    public Properties toProperties() {
        Properties properties = new Properties();
        if( address != null ) properties.setProperty("address", address);
        properties.setProperty("addressType", String.valueOf(addressType));
        if( version != null ) properties.setProperty("version", version);
        if( deviceId != null ) properties.setProperty("deviceId", deviceId);
        if( devicePort != null ) properties.setProperty("devicePort", devicePort);
        if( platform != null ) properties.setProperty("platform", platform);
        if( capabilities != null ) properties.setProperty("capabilities", capabilities);
        properties.setProperty("nativeVLAN", String.valueOf(nativeVLAN));
        return properties;
    }
}
