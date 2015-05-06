package dnt.monitor.engine.snmp;

import dnt.monitor.engine.exception.SnmpException;
import net.happyonroad.model.GeneralMap;
import org.snmp4j.smi.OID;

import java.util.List;

/**
 * <h1>可以在MIB的支持下进行SNMP访问的对象</h1>
 *
 * @author Jay Xiong
 */
public interface MibAwareSnmpVisitor extends SnmpVisitor {


    /**
     * <h2>设置SNMP高级方式的参数</h2>
     *
     * @param key   参数名称
     * @param value 参数值
     * @see #MAX_ROWS_PER_PDU
     * @see #MAX_COLS_PER_PDU
     * @see #PAGE_SIZE
     */
    void setOption(String key, Object value);

    /**
     * <h1>获取一个Object Id下所有的Instance，其返回Map的Key为MIB信息中的Name，且移除列名中多余的prefix</h1>
     * <p/>
     * 照理这种方式应该忽略表格，但现在尚未做到
     *
     * @param oid    Object OID
     * @param prefix 需要被移除的prefix，如果不进行移除，传入NULL即可
     * @return 对应的内容列表
     * @throws dnt.monitor.engine.exception.SnmpException
     * @throws UnsupportedOperationException              如果相应的MIB信息尚未被编译支持，则抛出异常
     */
    GeneralMap<String, Object> walk(String oid, String prefix) throws SnmpException;

    /**
     * <h1>获取一个Object Id下所有的Instance，其返回Map的Key为MIB信息中的Name，且移除列名中多余的prefix</h1>
     * <p/>
     * 照理这种方式应该忽略表格，但现在尚未做到
     *
     * @param timeout 超时时间，单位毫秒
     * @param oid     Object OID
     * @param prefix  需要被移除的prefix，如果不进行移除，传入NULL即可
     * @return 对应的内容列表
     * @throws dnt.monitor.engine.exception.SnmpException
     * @throws UnsupportedOperationException              如果相应的MIB信息尚未被编译支持，则抛出异常
     */
    GeneralMap<String, Object> walk(long timeout, String oid, String prefix) throws SnmpException;

    /**
     * <h2>自动分页获取某个SNMP Table全表</h2>
     *
     * @param oid    表格的OID，不是entry的(系统会自动增加.1)
     * @param prefix 需要剔除的列前缀，默认为空
     * @return 表格数据解析出来的对象
     * @throws SnmpException
     */
    List<GeneralMap<String, Object>> table(String oid, String prefix) throws SnmpException;

    /**
     * <h2>自动分页获取某个SNMP Table全表</h2>
     *
     * @param timeout 超时时间，单位毫秒
     * @param oid     表格的OID，不是entry的(系统会自动增加.1)
     * @param prefix  需要剔除的列前缀，默认为空
     * @return 表格数据解析出来的对象
     * @throws SnmpException
     */
    List<GeneralMap<String, Object>> table(long timeout, String oid, String prefix) throws SnmpException;

    /**
     * <h2>获取某个SNMP Table的局部</h2>
     * <p/>
     * SNMP一般有一个属性说明总的接口数目，可以先基于该数目做一个预估，决定如何获取
     *
     * @param timeout 取此页的超时时间，单位毫秒
     * @param oid     表格的OID，不是entry的(系统会自动增加.1)
     * @param prefix: 需要剔除的列前缀，默认为空
     * @param lower:  从哪个Instance开始，默认为null
     * @param upper:  到哪个Instance结束，默认为null
     *                查询表格时候的控制参数，可以不设置，一切采用默认参数，如果设置，可用的选项为：
     * @return 表格数据解析出来的对象
     * @throws SnmpException
     * @see #setOption(String, Object)
     */
    List<GeneralMap<String, Object>> table(long timeout, String oid, String prefix, OID lower, OID upper) throws SnmpException;
}
