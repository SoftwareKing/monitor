/**
 * Developer: Kadvin Date: 15/3/4 下午1:09
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.annotation.snmp.Group;
import dnt.monitor.annotation.snmp.OID;
import net.happyonroad.model.Credential;

import java.util.List;

/**
 * <h1>IP(SNMP)设备</h1>
 *
 * 参考 RFC-1213:
 * .1.3.6.1.2.1(org.dod.internet.mgmt.mib-2.system)
 */
@Category( value = "device", credentials = Credential.Snmp)
@Group(value = "1.3.6.1.2.1.1", prefix = "sys")
public class Device extends Resource {
    private static final long   serialVersionUID = 642723794375481995L;
    // 也可以将以下 sys 开头的属性映射为一个 SystemInfo 对象
    // sys.Descr
    @Indicator
    @OID("Descr")
    private String        description;
    @Indicator
    @OID("ObjectID")
    private String        objectID;
    // sys.UpTime
    @Indicator
    @OID("UpTimeInstance")
    private String        upTime;
    @Indicator
    @OID("Contact")
    private String        contact;
    // sys.Location
    @Indicator
    @OID("Location")
    private String        location;
    // IP Services
    private List<Service> services;

    @Config
    @OID("Name")
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    //并没有像北塔设计的那样，用 InterfaceScalar（接口固态信息) + Interface 两个属性表达
    // 而是由场景驱动（读取配置时，对interface这个组件的采集参数，就不包括性能指标，定期检测时，就要采集性能指标)
    // 虽然在底层， interface与 arp, router, address等一样，都是一个snmp table
    // 但由于在上层的管理方式有巨大的差异，所以，interface不是被简单的映射为一个数据结构，而是一个子组件
    @Keyed
    private List<NIC>      interfaces;
    //配置指标, 为了mybatis能够最方便的映射，不丢失类型信息(class[]) 以下直接存储在主表上的属性采用object array类型
    @Keyed
    private AddressEntry[] addresses;
    // 路由 表 均设计为一种数据结构
    @Keyed
    private RouteEntry[]   routeEntries;
    // ARP 表 均设计为一种数据结构
    // 不在字段上标记，也可以在实体类上标记
    private ARPEntry[]     arpEntries;

    private TcpEntry[] tcpEntries;
    private UdpEntry[] udpEntries;

    public Device() {
        setType("/device");
    }

    //////////////////////////////////////////////////////////////////
    // 信息指标: 基本属性
    //////////////////////////////////////////////////////////////////

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUpTime() {
        return upTime;
    }

    public void setUpTime(String upTime) {
        this.upTime = upTime;
    }

    public String getObjectID() {
        return objectID;
    }

    public void setObjectID(String objectID) {
        this.objectID = objectID;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    //////////////////////////////////////////////////////////////////
    // 组件构成
    //////////////////////////////////////////////////////////////////

    public List<NIC> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(List<NIC> interfaces) {
        this.interfaces = interfaces;
    }


    //地址这样的指标，也与link类似，可以通过在get方法里面自行计算
    public AddressEntry[] getAddresses() {
        return addresses;
    }

    //也可以在metric definition里面声明查询语句来获取
    public void setAddresses(AddressEntry[] addresses) {
        this.addresses = addresses;
    }


    public ARPEntry[] getArpEntries() {
        return arpEntries;
    }

    public void setArpEntries(ARPEntry[] arpEntries) {
        this.arpEntries = arpEntries;
    }

    public RouteEntry[] getRouteEntries() {
        return routeEntries;
    }

    public void setRouteEntries(RouteEntry[] routeEntries) {
        this.routeEntries = routeEntries;
    }

    public TcpEntry[] getTcpEntries() {
        return tcpEntries;
    }

    public void setTcpEntries(TcpEntry[] tcpEntries) {
        this.tcpEntries = tcpEntries;
    }

    public UdpEntry[] getUdpEntries() {
        return udpEntries;
    }

    public void setUdpEntries(UdpEntry[] udpEntries) {
        this.udpEntries = udpEntries;
    }

    public List<Service> getServices() {
        return services;
    }

    public void setServices(List<Service> services) {
        this.services = services;
    }
}
