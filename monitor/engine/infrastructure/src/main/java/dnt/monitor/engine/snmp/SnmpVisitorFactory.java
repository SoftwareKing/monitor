package dnt.monitor.engine.snmp;

import dnt.monitor.model.ResourceNode;
import net.happyonroad.credential.SnmpCredential;

/**
 * <h1>SNMP访问者工厂</h1>
 *
 * @author Jay Xiong
 */
public interface SnmpVisitorFactory {
    /**
     * <h2>获取访问特定地址的SNMP对象</h2>
     *
     * @param node    被访问对象
     * @param credential 认证方式
     * @return SNMP访问对象
     */
    MibAwareSnmpVisitor visitor(ResourceNode node, SnmpCredential credential);
}
