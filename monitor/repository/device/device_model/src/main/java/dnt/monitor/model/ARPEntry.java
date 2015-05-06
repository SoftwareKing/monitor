/**
 * Developer: Kadvin Date: 14-3-3 下午5:50
 */
package dnt.monitor.model;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;

/**
 * <h1>MAC(NetToMedia)表项</h1>
 * <dl>
 * <dt>包括:</dt>
 * <dd>类型：Type</dd>
 * <dd>网络地址：NetAddress</dd>
 * <dd>物理地址：PhysAddress</dd>
 * <dd>接口序号：IfIndex</dd>
 * </dl>
 */
@Table(value = "1.3.6.1.2.1.4.22", prefix = "ipNetToMedia", timeout = "5m")
@Shell({
        @OS(type = "linux", command = @Command("arp -n | grep -v ^Address"),
                mapping = @Mapping({"netAddress", "", "physAddress", "", "ifDescr"})),
        @OS(type = "aix"  , command = @Command("arp -an   | grep stor | awk '{print  $2,$4,$1}' | sed 's/(//g;s/)//g'"),
                mapping = @Mapping({"netAddress",   "physAddress",   "ifDescr"})),
        @OS(type = "osx", command = @Command("classpath:./ARPEntry@osx.sh"),
                mapping = @Mapping({"netAddress", "physAddress", "ifDescr"}))
})
public class ARPEntry extends Entry implements Comparable<ARPEntry> {
    private static final long serialVersionUID = -329269806640624189L;
    @OID("IfIndex")
    @Shell({
            @OS(type = "linux", command = @Command("classpath:./IfIndex@linux.sh")),
            //@OS(type = "aix"  , command = @Command("ifconfig -a | grep \"<\" | awk -F: '{print NR,$1}; END {print \"0\",\"?\"}' | grep '${ifDescr}' | awk '{print $1}'")),
            @OS(type = "aix"  , command = @Command("echo 0")),
            @OS(type = "osx"  , command = @Command("classpath:./IfIndex@osx.sh"))
    })
    private int ifIndex;

    private String ifDescr;

    @OID("NetAddress")
    private String netAddress;// instance also

    @OID("PhysAddress")
    private String physAddress;

    @OID("Type")
    private int type;

    @Override
    public int compareTo(@SuppressWarnings("NullableProblems") ARPEntry another) {
        return this.ifIndex - another.ifIndex;
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

    public String getNetAddress() {
        return netAddress;
    }

    public void setNetAddress(String netAddress) {
        this.netAddress = netAddress;
    }

    public String getPhysAddress() {
        return physAddress;
    }

    public void setPhysAddress(String physAddress) {
        this.physAddress = physAddress;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ARPEntry)) return false;

        ARPEntry arpEntry = (ARPEntry) o;

        if (ifIndex != arpEntry.ifIndex) return false;
        if (type != arpEntry.type) return false;
        if (netAddress != null ? !netAddress.equals(arpEntry.netAddress) : arpEntry.netAddress != null) return false;
        if (physAddress != null ? !physAddress.equals(arpEntry.physAddress) : arpEntry.physAddress != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = ifIndex;
        result = 31 * result + (netAddress != null ? netAddress.hashCode() : 0);
        result = 31 * result + (physAddress != null ? physAddress.hashCode() : 0);
        result = 31 * result + type;
        return result;
    }

    @Override
    public String toString() {
        return "ARPEntry(" + netAddress + '@' + physAddress + '/' + ifIndex + ')';
    }
}
