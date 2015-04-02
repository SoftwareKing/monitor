/**
 * Developer: Kadvin Date: 14/12/25 下午12:52
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.snmp.OID;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;
import net.happyonroad.type.Availability;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * <h1>网卡</h1>
 * Network Interface Card
 * Host -has many-> NICs
 */
@Anchor("index")
@Table(value = "1.3.6.1.2.1.2.2", prefix = "if")
@Command("cat /proc/net/dev | sed s/:/\\ \\ /g")
@Mapping(skipLines = 2,colSeparator = "\\s+|\\s*\\|\\s*",value = {"label","","inPkts","inErrs","inDiscards","","","","","","outPkts","outErrs","outDiscards","","","",""})
public class NIC extends Component<Device> {
    private static final long serialVersionUID = 3186700680010583518L;

    @Config  // stored at label
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    @Indicator
    @OID("Index")
    @Command("ip address show ${label} | awk '{if(NR==1){split($1,a,\":\");print a[1];}}'")
    //接口序号（Index）
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
    private long    speed;
    //Mac地址：  PhysAddress
    @Indicator
    @OID("PhysAddress")
    //@Command("ip addr show $label")
    private String address;
    //使用状态: UsageStatus
    //  Active, Idle, Busy
    //管理状态： AdminStatus
    // Locked, Shutting Down, Unlocked
    @Indicator
    @OID("AdminStatus")
    private int adminStatus;
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

    @Metric
    private Float usage;

    @Metric
    @OID("OutQLen")
    private Long queueLength;

    @Metric
    @OID("InOctets")
    private Double rx;
    @Metric
    @OID("OutOctets")
    private Double tx;
    @Metric
    private Double rtx;

    @Metric
    private Double trx;
    @Metric
    private Double ttx;
    @Metric
    private Double trtx;

    @Metric
    @OID("InUcastPkts")
    private Long inPkts;
    @Metric
    @OID("InDiscards")
    private Long inDiscards;
    @Metric
    @OID("InErrors")
    private Long inErrs;
    @Metric
    @OID("OutUcastPkts")
    private Long outPkts;
    @Metric
    @OID("OutDiscards")
    private Long outDiscards;
    @Metric
    @OID("OutErrors")
    private Long outErrs;
    @Metric
    private Long collisions;

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

    public Double getTrx() {
        return trx;
    }

    public void setTrx(Double trx) {
        this.trx = trx;
    }

    public Double getTtx() {
        return ttx;
    }

    public void setTtx(Double ttx) {
        this.ttx = ttx;
    }

    public Double getTrtx() {
        return trtx;
    }

    public void setTrtx(Double trtx) {
        this.trtx = trtx;
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
