/**
 * Developer: Kadvin Date: 14-6-5 下午1:27
 */
package dnt.monitor.model;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.shell.OS;
import dnt.monitor.annotation.snmp.*;
import net.happyonroad.util.IpUtils;
import org.apache.commons.net.util.SubnetUtils;

/**
 * <h1>IP Addr表项</h1>
 * <dl>
 * <dt>包括:</dt>
 * <dd>接口序号：ifIndex</dd>
 * <dd>接口序号：ifDescr</dd>
 * <dd>最大组包大小：reasmMaxSize</dd>
 * <dd>地址：addr</dd>
 * <dd>掩码：betMask</dd>
 * <dd>是否广播地址：bcastAddr</dd>
 * </dl>
 */
@Table(value = "1.3.6.1.2.1.4.20", prefix = "ipAdEnt")
@Shell({
        @OS(type = "linux", command = @Command("classpath:./AddressEntry@linux.sh")),
        @OS(type = "aix"  , command = @Command("ifconfig -a | egrep \"flags|inet\" | grep -v \"inet6\" | sed 'N;s/\\n/ :/' | awk -F: '{print $1,$3}' | awk '{if (\"broadcast\"==$6) { print NR,$1,$3,$5,\"true\"; } else {print $NR,$1,$3,$5,\"false\";}}'"),
                mapping = @Mapping(value = {"ifIndex", "ifDescr", "addr", "netMask", "bcastAddr"})),
        @OS(type = "osx"  , command = @Command("classpath:./AddressEntry@osx.sh")),
})
@Mapping({"ifIndex", "ifDescr", "reasmMaxSize", "addr", "netMask", "bcastAddr"})
public class AddressEntry extends Entry {
    private static final long serialVersionUID = 7336442864329942789L;
    @OID("IfIndex")
    private int     ifIndex;
    private String  ifDescr;
    @OID("Addr")
    private String  addr;
    @OID("NetMask")
    private String  netMask;
    @OID("BcastAddr")
    private boolean bcastAddr;
    @dnt.monitor.annotation.snmp.OS(
        type = "windows",
        oid = @OID("ReasmMaxSize")
    )
    private int     reasmMaxSize;

    public String getAddr() {
        return addr;
    }

    public void setAddr(String addr) {
        this.addr = addr;
    }

    public int getIfIndex() {
        return ifIndex;
    }

    public void setIfIndex(int ifIndex) {
        this.ifIndex = ifIndex;
    }

    public String getIfDescr() {
        return ifDescr;
    }

    public void setIfDescr(String ifDescr) {
        this.ifDescr = ifDescr;
    }

    public String getNetMask() {
        return netMask;
    }

    public void setNetMask(String netMask) {
        if( netMask == null ){
            this.netMask = null;
            return;
        }
        //Linux/osx net mask will got /16, /8, /24这种
        if (netMask.startsWith("/")) {
            netMask = new SubnetUtils(getAddr() + netMask).getInfo().getNetmask();
        } else if (netMask.startsWith("0x")) {
            // like: 0xffffff00
            netMask = IpUtils.toMask(netMask);
        }
        this.netMask = netMask;
    }

    public boolean isBcastAddr() {
        return bcastAddr;
    }

    public void setBcastAddr(boolean bcastAddr) {
        this.bcastAddr = bcastAddr;
    }

    public int getReasmMaxSize() {
        return reasmMaxSize;
    }

    public void setReasmMaxSize(int reasmMaxSize) {
        this.reasmMaxSize = reasmMaxSize;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AddressEntry)) return false;

        AddressEntry entry = (AddressEntry) o;

        if (bcastAddr != entry.bcastAddr) return false;
        if (ifIndex != entry.ifIndex) return false;
        if (reasmMaxSize != entry.reasmMaxSize) return false;
        if (addr != null ? !addr.equals(entry.addr) : entry.addr != null) return false;
        if (netMask != null ? !netMask.equals(entry.netMask) : entry.netMask != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = ifIndex;
        result = 31 * result + (addr != null ? addr.hashCode() : 0);
        result = 31 * result + (netMask != null ? netMask.hashCode() : 0);
        result = 31 * result + (bcastAddr ? 1 : 0);
        result = 31 * result + reasmMaxSize;
        return result;
    }

    @Override
    public String toString() {
        return "AddressEntry(" + addr + '/' + netMask + ')';
    }
}
