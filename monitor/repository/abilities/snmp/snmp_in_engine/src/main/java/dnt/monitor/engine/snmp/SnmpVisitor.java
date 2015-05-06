package dnt.monitor.engine.snmp;


import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.service.Visitor;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.model.GeneralMap;

/**
 * <h1>简单的SNMP辅助接口</h1>
 * <h2>类似于NET-SNMP库，辅助的功能如下：</h2>
 * <dl>
 * <dt><strong>snmp-get</strong></dt>
 * <dd> get(oid:String) : Object </dd>
 * <dd> gets(oids:String[]) : Map&lt;String, Object&gt; </dd>
 * <dt><strong>snmp-walk</strong></dt>
 * <dd> walk(oid:String) : Map&lt;String, Object&gt; </dd>
 * <dt><strong>bulk</strong></dt>
 * <dd> bulk(oids:String[]) : Map&lt;String, Object&gt; </dd>
 * </dl>
 * 该接口
 * <ul>
 * <li>屏蔽协议内部实现，如get-next被封装在walk, table等操作中，不直接对外</li>
 * <li>暂不支持高级SNMP功能：TRAP, INFORM, SET</li>
 * </ul>
 *
 * @author JayXiong
 */
public interface SnmpVisitor extends Visitor<SnmpCredential> {
    final String MAX_ROWS_PER_PDU = "maxRowsPerPDU";
    final String MAX_COLS_PER_PDU = "maxColsPerPDU";
    final String PAGE_SIZE = "pageSize";

    /**
     * 获取一个OID对应的对象值
     *
     * @param oid 一个 Instance 的 OID
     * @return 对应的对象值，如果出错，抛出EngineException
     */
    Object get(String oid) throws SnmpException;

    /**
     * 以特定超时限制，获取一个OID对应的对象值
     *
     * @param timeout 超时时间，单位毫秒
     * @param oid 一个 Instance 的 OID
     * @return 对应的对象值，如果出错，抛出EngineException
     */
    Object get(long timeout, String oid) throws SnmpException;

    /**
     * <h2>获取一批OID对应的内容</h2>
     * 这个方法不同于bulk，它是逐个去获取instance的信息
     *
     * @param oids 一批Instance 的 OID
     * @return 对应的内容Map，其中的Key是子oid的定位符，Value是相应的值
     * @throws SnmpException
     */
    GeneralMap<String, Object> gets(String... oids) throws SnmpException;


    /**
     * <h2>获取一批OID对应的内容</h2>
     * 这个方法不同于bulk，它是逐个去获取instance的信息
     *
     * @param timeout 超时时间，单位毫秒
     * @param oids 一批Instance 的 OID
     * @return 对应的内容Map，其中的Key是子oid的定位符，Value是相应的值
     * @throws SnmpException
     */
    GeneralMap<String, Object> gets(long timeout, String... oids) throws SnmpException;


    /**
     * 以bulk方式获取一批oid对应的next值(标量)
     * <ul>
     * <li>如果oid是object id，则其返回的对应为instance；</li>
     * <li>如果oid是instance id，则其返回的为next instance</li>
     * </ul>
     *
     * @param oids 需要获取的OID
     * @return 返回的数据
     */
    GeneralMap<String, Object> bulk(String... oids) throws SnmpException;

    /**
     * 以bulk方式获取一批oid对应的next值(标量)
     * <ul>
     * <li>如果oid是object id，则其返回的对应为instance；</li>
     * <li>如果oid是instance id，则其返回的为next instance</li>
     * </ul>
     *
     * @param timeout 超时时间，单位毫秒
     * @param oids 需要获取的OID
     * @return 返回的数据
     */
    GeneralMap<String, Object> bulk(long timeout, String... oids) throws SnmpException;

    /**
     * 迭代一个节点，获取其下所有的变量，如果其中包括表格，表格将会是分散的
     * 如果需要组织起来的表格，应该基于EnhancedHelper
     *
     * @param oid 被walk的树节点oid
     * @return 组织在Map中的对象树
     * @throws SnmpException
     */
    GeneralMap<String, Object> walk(String oid) throws SnmpException;

    /**
     * 迭代一个节点，获取其下所有的变量，如果其中包括表格，表格将会是分散的
     * 如果需要组织起来的表格，应该基于EnhancedHelper
     *
     * @param timeout 超时时间，单位毫秒
     * @param oid 被walk的树节点oid
     * @return 组织在Map中的对象树
     * @throws SnmpException
     */
    GeneralMap<String, Object> walk(long timeout, String oid) throws SnmpException;

}
