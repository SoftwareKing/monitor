/**
 * Developer: Kadvin Date: 14-3-3 下午5:52
 */
package dnt.monitor.model;

import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import dnt.monitor.annotation.ssh.Value;
import org.apache.commons.net.util.SubnetUtils;

/**
 * <h1>路由表表项</h1>
 * <dl>
 * <dt>包括:</dt>
 * <dd>类型:Type</dd>
 * <dd>接口序号:IfIndex</dd>
 * <dd>目的地址:Dest</dd>
 * <dd>子网掩码:Mask</dd>
 * <dd>下一跳地址:NextHop</dd>
 * <dd>其他属性</dd>
 * </dl>
 */
@Table(value = "1.3.6.1.2.1.4.21", prefix = "ipRoute")
@Command(value = "route -n", timeout = "2m")
@Mapping(skipLines = 1)
public class RouteEntry extends Entry {
    private static final long serialVersionUID = 7787211577546885531L;
    @OID("Type")
    int type;
    @OID("IfIndex")
    @Command("ip address show ${ifDescr} | awk '{if(NR==1){split($1,a,\":\");print a[1];}}'")
    int ifIndex;
    @Value("Iface")
    String ifDescr;
    @Value("Destination")
    @OID("Dest")
    String dest;
    @Value("Genmask")
    @OID("Mask")
    String mask;
    @Value("Gateway")
    @OID("NextHop")
    String nextHop;
    @OID("Proto")
    int proto;
    @OID("Age")
    int age;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
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

    public String getDest() {
        return dest;
    }

    public void setDest(String dest) {
        this.dest = dest;
    }

    public String getMask() {
        return mask;
    }

    public void setMask(String mask) {
        this.mask = mask;
    }

    public String getNextHop() {
        return nextHop;
    }

    public void setNextHop(String nextHop) {
        this.nextHop = nextHop;
    }

    public int getProto() {
        return proto;
    }

    public void setProto(int proto) {
        this.proto = proto;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RouteEntry)) return false;

        RouteEntry that = (RouteEntry) o;

        if (ifIndex != that.ifIndex) return false;
        if (type != that.type) return false;
        if (dest != null ? !dest.equals(that.dest) : that.dest != null) return false;
        if (mask != null ? !mask.equals(that.mask) : that.mask != null) return false;
        if (nextHop != null ? !nextHop.equals(that.nextHop) : that.nextHop != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = type;
        result = 31 * result + ifIndex;
        result = 31 * result + (dest != null ? dest.hashCode() : 0);
        result = 31 * result + (mask != null ? mask.hashCode() : 0);
        result = 31 * result + (nextHop != null ? nextHop.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "RouteEntry(" +dest + '/' +mask + " -> " + nextHop + ')';
    }

    public String toSubnet() {
        return new SubnetUtils(dest, mask).getInfo().getCidrSignature();
    }
}
