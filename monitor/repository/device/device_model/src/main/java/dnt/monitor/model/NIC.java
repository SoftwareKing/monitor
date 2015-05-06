/**
 * Developer: Kadvin Date: 14/12/25 下午12:52
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dnt.monitor.annotation.*;
import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;
import net.happyonroad.type.Availability;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * <h1>网卡</h1>
 * Network Interface Card
 * Host -has many-> NICs
 */
@Anchor("index")
@Table(value = "1.3.6.1.2.1.2.2", prefix = "if", timeout = "1m")
@Shell({
        @OS(type = "linux", command = @Command("cat /proc/net/dev | grep -v ^Inter | grep -v ^\\ face | sed s/:/\\ \\ /g"),
                mapping = @Mapping(colSeparator = "\\s+|\\s*\\|\\s*",
                        value = {"label", "inOctets", "inPkts", "inErrs", "inDiscards", "", "", "", "",
                                 "outOctets", "outPkts", "outErrs", "outDiscards", "", "", "", ""})),
        @OS(type = "aix", command = @Command("netstat -in | egrep -v 'link|::1' | tail -n +2 | awk '{print NR,$1,$2,$5,$6,$7,$8}'"),
                mapping = @Mapping({"index", "label", "mtu","inPkts", "inErrs", "outPkts", "outErrs"})),
        @OS(type = "osx", command = @Command("classpath:./NIC@osx.sh"),
                mapping = @Mapping(colSeparator = "\\s+|\\s*\\|\\s*",
                        value = {"label", "mtu", "", "address", "inPkts", "inErrs",
                                 "outPkts", "outErrs", "collisions", "discards"}))
})
public class NIC extends Component<Device> {
    private static final long serialVersionUID = 3186700680010583518L;

    @Config  // stored at label
    @Override
    @Value("label")
    @OID("Descr")
    public void setLabel(String label) {
        if (label != null && label.endsWith("*")) {
            label = label.substring(1, label.indexOf("*"));
        }
        super.setLabel(label);
    }

    @JsonIgnore
    // for below IfIndex.sh
    @SuppressWarnings("UnusedDeclaration")
    public String getIfDescr() {
        return getLabel();
    }

    //接口序号（Index）
    @Indicator
    @OID("Index")
    @Shell({
            @OS(type = "linux", command = @Command("classpath:./IfIndex@linux.sh")),
            @OS(type = "osx"  , command = @Command("classpath:./IfIndex@osx.sh"))
    })
    private int    index;
    @Indicator
    //接口类型（Type）, 1-32
    @OID("Type")
    private int    ifType;
    //最大包大小：Mtu
    @Indicator
    @OID("Mtu")
    private int    mtu;
    //当前带宽速度：Speed(Bandwidth)
    @Indicator
    @OID("Speed")
    @Shell({
            //netstat -v ${ifDescr} | grep "Media Speed Running:" | sed 's/Media Speed Running://g' | sed 's/Unknown/0/g' | awk '{print 1000*1000*$1}'
            @OS(type = "aix", command = @Command("if [ ${ifDescr} != 'lo0' ] ; then netstat -v ${ifDescr} | grep \"Media Speed Running:\" | sed 's/Media Speed Running://g' | sed 's/Unknown/0/g' | awk '{print 1000*1000*$1}';fi")),
    })
    private long   speed;
    //Mac地址：  PhysAddress
    @Indicator
    @OID("PhysAddress")
    //@Command("ip addr show $label")
    @Shell ({
            @OS(type = "aix"  , command=@Command("if [ ${ifDescr} != 'lo0' ] ; then entstat ${ifDescr} | grep Hardware | sed 's/Hardware Address://g' | sed 's/ //g' ; fi"))
    })
    private String address;
    //使用状态: UsageStatus
    //  Active, Idle, Busy
    //管理状态： AdminStatus
    // Locked, Shutting Down, Unlocked
    @Indicator
    @OID("AdminStatus")
    private int    adminStatus;

    // 将 oper status 转换为可用性指标
    //操作状态： OperStatus
    // 1(down, disabled), 2(up, enabled), 3(testing)
    @Indicator
    //@OID("OperStatus")
    @Override
    public Availability getAvailability() {
        return super.getAvailability();
    }
    //北塔还增加了一个组合的status：UP，DOWN，DORMANT（睡眠状态），UNKNOWN

    @Metric(critical = 90, warning = 80, unit = "%")
    private Float usage;

    @Metric(critical = 10000, warning = 5000, unit = "Package")
    @OID("OutQLen")
    private Long queueLength;

    //底层设备的InOctets这个字段给出的相应时间点的接收了多少bytes，绝对值
    @OID("InOctets")
    @Indicator
    @Shell ({
            @OS(type = "aix"  , command=@Command("entstat ${label} | grep Bytes| sed 's/Bytes://g'| awk '{print $2}'"))//,
                   // mapping = @Mapping(value = {  "outOctets", "inOctets"}))
    })
    private Long inOctets;

    // 入流量，以MB为单位
    // rx 由 inOctets 差分计算得来, 在计算该值时，还需要提供上次采值的记录(updatedAt, inOctets)
    @Metric(critical = 1, warning = 0.5f, unit = "MB/s")
    @Depends("inOctets")
    private Double rx;

    //底层设备的OutOctets这个字段给出的相应时间点的接收了多少bytes，绝对值
    @OID("OutOctets")
    @Indicator
    @Shell ({
            @OS(type = "aix"  , command=@Command("entstat en0 | grep Bytes| sed 's/Bytes://g'| awk '{print $1}'"))
    })
    private Long outOctets;

    // tx 由 outOctets 差分计算得来
    @Metric(critical = 2, warning = 1, unit = "MB/s")
    @Depends("outOctets")
    private Double tx;


    //这个数值，是将接收 + 发送的 bytes  / interval
    @Metric(critical = 2, warning = 1, unit = "MB/s")
    @Depends({"inOctets", "outOctets"})
    private Double rtx;

    @Indicator
    @OID("InUcastPkts")
    private Long inPkts;
    @Indicator
    @OID("InDiscards")
    private Long inDiscards;
    @Indicator
    @OID("InErrors")
    private Long inErrs;
    @Indicator
    @OID("OutUcastPkts")
    private Long outPkts;
    @Indicator
    @OID("OutDiscards")
    private Long outDiscards;
    @Indicator
    @OID("OutErrors")
    private Long outErrs;
    @Indicator
    private Long collisions;
    //丢弃的包总数，mac下面可以获得总数，但获得不了inDiscards/outDiscards
    @Indicator
    private Long discards;

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getIfType() {
        return ifType;
    }

    public void setIfType(int ifType) {
        this.ifType = ifType;
    }

    //这种非setter上的模型，将不会有对应的指标名称
    // 届时生成阀值规则时，会根据是否
    @JsonIgnore
    public int getSimpleType() {
        return SIMPLE_TYPES.get(getIfType());
    }

    public int getMtu() {
        return mtu;
    }

    public void setMtu(int mtu) {
        this.mtu = mtu;
    }

    public long getSpeed() {
        return speed;
    }

    public void setSpeed(long speed) {
        this.speed = speed;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getAdminStatus() {
        return adminStatus;
    }

    public void setAdminStatus(int adminStatus) {
        this.adminStatus = adminStatus;
    }

    public Float getUsage() {
        return usage;
    }

    public void setUsage(Float usage) {
        this.usage = usage;
    }

    public Long getQueueLength() {
        return queueLength;
    }

    public void setQueueLength(Long queueLength) {
        this.queueLength = queueLength;
    }

    public Double getRx() {
        return rx;
    }

    public void setRx(Double rx) {
        this.rx = rx;
    }

    public Double getTx() {
        return tx;
    }

    public void setTx(Double tx) {
        this.tx = tx;
    }

    public Double getRtx() {
        return rtx;
    }

    public void setRtx(Double rtx) {
        this.rtx = rtx;
    }

    public Long getInOctets() {
        return inOctets;
    }

    public void setInOctets(Long inOctets) {
        this.inOctets = inOctets;
    }

    public Long getOutOctets() {
        return outOctets;
    }

    public void setOutOctets(Long outOctets) {
        this.outOctets = outOctets;
    }

    @JsonIgnore
    public Long getTotalOctets() {
        long inOct = this.inOctets == null ? 0 : this.inOctets;
        long outOct = this.outOctets == null ? 0 : this.outOctets;
        return inOct + outOct;
    }

    public Long getInPkts() {
        return inPkts;
    }

    public void setInPkts(Long inPkts) {
        this.inPkts = inPkts;
    }

    public Long getInErrs() {
        return inErrs;
    }

    public void setInErrs(Long inErrs) {
        this.inErrs = inErrs;
    }

    public Long getOutPkts() {
        return outPkts;
    }

    public void setOutPkts(Long outPkts) {
        this.outPkts = outPkts;
    }

    public Long getOutErrs() {
        return outErrs;
    }

    public void setOutErrs(Long outErrs) {
        this.outErrs = outErrs;
    }

    public Long getInDiscards() {
        return inDiscards;
    }

    public void setInDiscards(Long inDiscards) {
        this.inDiscards = inDiscards;
    }

    public Long getOutDiscards() {
        return outDiscards;
    }

    public void setOutDiscards(Long outDiscards) {
        this.outDiscards = outDiscards;
    }

    public Long getCollisions() {
        return collisions;
    }

    public void setCollisions(Long collisions) {
        this.collisions = collisions;
    }

    public Long getDiscards() {
        return discards;
    }

    public void setDiscards(Long discards) {
        this.discards = discards;
    }

    //  type means
    //  other(1)              regular1822(2)      hdh1822(3)          ddn-x25(4)
    //  rfc877-x25(5)         ethernet-csmacd(6)  iso88023-csmacd(7)  iso88024-tokenBus(8)
    //  iso88025-tokenRing(9) iso88026-man(10)    starLan(11)         proteon-10Mbit(12)
    //  proteon-80Mbit(13)    hyperchannel(14)    fddi(15)            lapb(16)
    //  sdlc(17)              dsl(18)             e1(19)              basicSDN(20)
    //  primarySDN(21)        propP2PSerial(22)   ppp(23)             softwareLoopback(24)
    //  eon(25)               ethernet-3Mbit(26)  nsip(27)            slip(28)
    //  ultra(29)             ds3(30)             sip(31)             frame-relay(32)
    // simpleType
    // 0=其他 1=以太网 2=E1 3=点到点 4=本地

    private static Map<Integer, Integer> SIMPLE_TYPES = new LinkedHashMap<Integer, Integer>();

    static {
        SIMPLE_TYPES.put(0, 0);// unset
        SIMPLE_TYPES.put(1, 0);
        SIMPLE_TYPES.put(2, 0);
        SIMPLE_TYPES.put(3, 0);
        SIMPLE_TYPES.put(4, 0);
        SIMPLE_TYPES.put(5, 0);
        SIMPLE_TYPES.put(6, 1);
        SIMPLE_TYPES.put(7, 0);
        SIMPLE_TYPES.put(8, 0);
        SIMPLE_TYPES.put(9, 0);
        SIMPLE_TYPES.put(10, 0);
        SIMPLE_TYPES.put(11, 1);
        SIMPLE_TYPES.put(12, 0);
        SIMPLE_TYPES.put(13, 0);
        SIMPLE_TYPES.put(14, 0);
        SIMPLE_TYPES.put(15, 0);
        SIMPLE_TYPES.put(16, 0);
        SIMPLE_TYPES.put(17, 0);
        SIMPLE_TYPES.put(18, 0);
        SIMPLE_TYPES.put(19, 2);
        SIMPLE_TYPES.put(20, 0);
        SIMPLE_TYPES.put(21, 0);
        SIMPLE_TYPES.put(22, 0);
        SIMPLE_TYPES.put(23, 3);
        SIMPLE_TYPES.put(24, 4);
        SIMPLE_TYPES.put(25, 0);
        SIMPLE_TYPES.put(26, 1);
        SIMPLE_TYPES.put(27, 0);
        SIMPLE_TYPES.put(28, 0);
        SIMPLE_TYPES.put(29, 0);
        SIMPLE_TYPES.put(30, 0);
        SIMPLE_TYPES.put(31, 0);
        SIMPLE_TYPES.put(32, 0);
    }
}
