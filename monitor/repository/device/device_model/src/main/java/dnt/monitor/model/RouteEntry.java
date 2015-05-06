/**
 * Developer: Kadvin Date: 14-3-3 下午5:52
 */
package dnt.monitor.model;

import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;
import net.happyonroad.util.IpUtils;
import org.apache.commons.net.util.SubnetUtils;
import org.springframework.util.StringUtils;

/**
 * <h1>路由表表项</h1>
 */
@Table(value = "1.3.6.1.2.1.4.21", prefix = "ipRoute")
// Type IfIndex Dest Mask NextHop
@Shell({
        @OS(type = "linux",
            command = @Command(value = "route -n | grep -v ^Kernel\\ IP", timeout = "2m")
            /*Destination        Gateway            Genmask      Flags     Metric Ref    Use Iface*/
        ),
        @OS(type = "aix",
                command = @Command(value = "netstat -rn | grep -v ^Rout | grep -v \"=>\" | egrep -v \"^$|::\" | awk '{print $1,$2,$3,$4,$5,$6}' | tail -n+2", timeout = "2m"),
            /*Destination        Gateway           Flags   Refs     Use  If*/
                mapping = @Mapping({"Destination","Gateway","Flags","Refs","Use","If"} )
        ),
        @OS(type = "osx",
            command = @Command(value = "netstat -nr -f inet | tail -n+4", timeout = "2m")
            /*Destination        Gateway            Flags        Refs      Use   Netif Expire*/
        )
})
public class RouteEntry extends Entry {
    private static final long serialVersionUID = 7787211577546885531L;
    @OID("Type")
    int    type;
    @OID("IfIndex")
    @Shell({
            @OS(type = "linux", command = @Command("classpath:./IfIndex@linux.sh")),
            @OS(type = "aix"  , command = @Command("ifconfig -a | grep \"<\" | awk -F: '{print NR,$1}' | grep '${ifDescr}' | awk '{print $1}'")),
            @OS(type = "osx"  , command = @Command("classpath:./IfIndex@osx.sh"))
    })
    int    ifIndex;
    @Shell({
            @OS(type = "linux", value = @Value("Iface")),
            @OS(type = "aix"  , value = @Value("If")),
            @OS(type = "osx"  , value = @Value("Netif"))
    })
    String ifDescr;
    @Value("Destination")
    @OID("Dest")
    //osx的destination可能为 10.37.129/24 形态,还不是10.37.129.0/24 这种规格化形态
            //由 setter 方法搞定
    String dest;
    @Shell(@OS(type = "linux", value = @Value("Genmask")))
    @OID("Mask")
    String mask;
    @Value("Gateway")
    @OID("NextHop")
    // osx许多gateway为物理地址，link#n, 这个由外部检查，使用
    String nextHop;
    @OID("Proto")
    int    proto;
    @dnt.monitor.annotation.snmp.OS(
            type = "windows",
            oid = @OID("Age")
    )
    // osx 的 expire 怎么转为 age?
    int    age;
    @Value("Flags")
    String flags;

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
        if( dest == null ){
            this.dest = null;
            return;
        }
        if (dest.equals("default")) {
            this.dest = "0.0.0.0";
            this.mask = "0.0.0.0";
        } else {
            String addr;
            String cidr = null;
            if (dest.contains("/")) {
                addr = dest.substring(0, dest.indexOf('/'));
                cidr = dest.substring(dest.indexOf('/'));
            } else {
                addr = dest;
            }
            int dots = StringUtils.countOccurrencesOf(addr, ".");
            for (int i = dots + 1; i < 4; i++) {
                addr = addr + ".0";
            }
            if (cidr != null) {
                SubnetUtils.SubnetInfo info = new SubnetUtils(addr + cidr).getInfo();
                this.dest = info.getNetworkAddress();
                this.mask = info.getNetmask();
            } else {
                this.dest = addr;
                String[] vals = addr.split("\\.");
                int[] ints = new int[4];
                for (int i = 0; i < vals.length; i++) {
                    String str = vals[i];
                    int val = Integer.valueOf(str);
                    ints[i] = (val > 0 ? 255 : 0 );
                }
                this.mask = IpUtils.toMask(ints);
            }
        }
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

    public String getFlags() {
        return flags;
    }

    public void setFlags(String flags) {
        this.flags = flags;
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
        return "RouteEntry(" + dest + '/' + mask + " -> " + nextHop + ')';
    }

    public String toSubnet() {
        return new SubnetUtils(dest, mask).getInfo().getCidrSignature();
    }
}
