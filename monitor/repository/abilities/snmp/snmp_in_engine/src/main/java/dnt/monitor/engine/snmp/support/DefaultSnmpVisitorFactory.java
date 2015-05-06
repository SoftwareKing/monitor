package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.snmp.MibRepository;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.engine.support.CommonVisitorFactory;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.credential.SnmpPassport;
import net.happyonroad.model.Credential;
import net.happyonroad.type.TimeInterval;
import org.apache.commons.lang.StringUtils;
import org.snmp4j.*;
import org.snmp4j.mp.MPv3;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.security.SecurityModel;
import org.snmp4j.security.SecurityModels;
import org.snmp4j.security.SecurityProtocols;
import org.snmp4j.security.USM;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.transport.DefaultUdpTransportMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Component;

import static org.snmp4j.security.SecurityLevel.*;

/**
 * <h1>The snmp visitor factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultSnmpVisitorFactory extends CommonVisitorFactory<SnmpCredential,MibAwareSnmpVisitor> implements SnmpVisitorFactory{
    //系统启动之后，会自动将该对象替换为DefaultMibRepository
    @Autowired
    MibRepository repository;

    @Override
    protected MibAwareSnmpVisitor createVisitor(ManagedNode node, Resource resource, SnmpCredential credential) {
        Target target = createTarget(resource.getAddress(), credential);
        //管理节点的属性，会被存到相应设备上来?
        String timeout = node.getProperty("snmp.connect.timeout", TimeInterval.parse(credential.getTimeout()));
        target.setTimeout(TimeInterval.parseInt(timeout));
        return new FullSnmpVisitor(node, target, resource, credential, getSnmp(), repository);
    }

    static Snmp snmp;

    @Override
    public boolean support(String address) {
        //only 主机地址，不支持 socket地址
        return !address.contains(":");
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof SnmpCredential;
    }

    public static Snmp getSnmp() {
        if (snmp != null) return snmp;
        try {
            snmp = initSnmp();
        } catch (Exception ex) {
            throw new ApplicationContextException("Failed to init snmp", ex);
        }
        return snmp;
    }

    private static Snmp initSnmp() {
        try {
            TransportMapping transport = new DefaultUdpTransportMapping();
            transport.listen();
            Snmp snmp = new Snmp(transport);
            byte[] localEngineID = MPv3.createLocalEngineID();
            USM usm = new USM(SecurityProtocols.getInstance(), new OctetString(localEngineID), 0);
            // 将USM添加至安全模式管理器中
            // 安全模型管理器采用了单例模式，它内部可以维护为3个安全模型，分别对应Snmp三个版本
            SecurityModels.getInstance().addSecurityModel(usm);
            snmp.setLocalEngine(localEngineID, 0, 0);
            return snmp;
        } catch (Exception ex) {
            throw new UnsupportedOperationException("Can't init the snmp transport!", ex);
        }
    }

    static Target createTarget(String address, SnmpCredential credential) {
        String stringVersion = credential.getVersion();
        int version = parseVersion(stringVersion);
        Target target;
        if (version == SnmpConstants.version3) {
            UserTarget userTarget = new UserTarget();
            SnmpPassport passport = credential.getPassport();
            userTarget.setSecurityLevel(parseSecurityLevel(stringVersion));
            userTarget.setSecurityModel(SecurityModel.SECURITY_MODEL_USM);

            userTarget.setSecurityName(new OctetString(passport.getAuthenticateMethod()));
            target = userTarget;
        } else {
            CommunityTarget communityTarget = new CommunityTarget();
            communityTarget.setCommunity(new OctetString(credential.getCommunity()));
            target = communityTarget;
        }
        String stringAddress = String.format("%s/%d", address, credential.getPort());
        UdpAddress udpAddress = new UdpAddress(stringAddress);
        target.setVersion(version);
        target.setAddress(udpAddress);
        target.setRetries(credential.getRetries());
        target.setTimeout(credential.getTimeout());
        return target;
    }

    static int parseVersion(String version) {
        if (StringUtils.equalsIgnoreCase(version, SNMPV1)) {
            return SnmpConstants.version1;
        } else if (StringUtils.equalsIgnoreCase(version, SNMPV2C)) {
            return SnmpConstants.version2c;
        } else if (StringUtils.startsWith(version, SNMPV3)) {
            return SnmpConstants.version3;
        } else {
            return SnmpConstants.version1;
        }
    }

    /*
     * Parse Versing String --> SecurityLevel
     */
    static int parseSecurityLevel(String version) {
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_NOAUTH_NOPRIV))
            return NOAUTH_NOPRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_MD5AUTH_NOPRIV))
            return AUTH_NOPRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_MD5AUTH_DESPRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_MD5AUTH_IDEAPRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_MD5AUTH_AES128PRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_MD5AUTH_AES192PRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_MD5AUTH_AES256PRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_SHAAUTH_NOPRIV))
            return AUTH_NOPRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_SHAAUTH_DESPRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_SHAAUTH_IDEAPRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_SHAAUTH_AES128PRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_SHAAUTH_AES192PRIV))
            return AUTH_PRIV;
        if (StringUtils.equalsIgnoreCase(version, SNMPV3_SHAAUTH_AES256PRIV))
            return AUTH_PRIV;
        return NOAUTH_NOPRIV;

    }

    public final static String SNMPV1                    = "V1";
    public final static String SNMPV2C                   = "V2C";
    public final static String SNMPV3                    = "V3";
    public final static String SNMPV3_NOAUTH_NOPRIV      = "SNMPV3_NOAUTH_NOPRIV";
    public final static String SNMPV3_MD5AUTH_NOPRIV     = "SNMPV3_MD5AUTH_NOPRIV";
    public final static String SNMPV3_MD5AUTH_DESPRIV    = "SNMPV3_MD5AUTH_DESPRIV";
    public final static String SNMPV3_MD5AUTH_IDEAPRIV   = "SNMPV3_MD5AUTH_IDEAPRIV";
    public final static String SNMPV3_MD5AUTH_AES128PRIV = "SNMPV3_MD5AUTH_AES128PRIV";
    public final static String SNMPV3_MD5AUTH_AES192PRIV = "SNMPV3_MD5AUTH_AES192PRIV";
    public final static String SNMPV3_MD5AUTH_AES256PRIV = "SNMPV3_MD5AUTH_AES256PRIV";
    public final static String SNMPV3_SHAAUTH_NOPRIV     = "SNMPV3_SHAAUTH_NOPRIV";
    public final static String SNMPV3_SHAAUTH_DESPRIV    = "SNMPV3_SHAAUTH_DESPRIV";
    public final static String SNMPV3_SHAAUTH_IDEAPRIV   = "SNMPV3_SHAAUTH_IDEAPRIV";
    public final static String SNMPV3_SHAAUTH_AES128PRIV = "SNMPV3_SHAAUTH_AES128PRIV";
    public final static String SNMPV3_SHAAUTH_AES192PRIV = "SNMPV3_SHAAUTH_AES192PRIV";
    public final static String SNMPV3_SHAAUTH_AES256PRIV = "SNMPV3_SHAAUTH_AES256PRIV";
}
