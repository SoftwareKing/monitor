package dnt.monitor.engine.snmp;

import net.percederberg.mibble.value.ObjectIdentifierValue;
import org.springframework.core.io.Resource;

import java.io.PrintWriter;

/**
 * <h1>The MIB Repository</h1>
 * <p/>
 * which will management all mib information
 * @author Jay Xiong
 */
public interface MibRepository {
    /**
     * 获取某个OID对应的元信息定义
     * <ul>
     * <li>如果尚未加载对应的MIB库，则返回null</li>
     * <li>如果传入了实例的OID，也将返回null</li>
     * </ul>
     *
     * @param oid 对应的OID
     * @return 对应的元信息
     */
    ObjectIdentifierValue getSymbol(String oid);

    /**
     * 将已知的MIB库信息预先加载到仓库中，为了效率考虑，并不实际解析和加载
     *
     * @param resources 预加载的资源集合
     */
    void preLoad(Resource... resources);

    /**
     * 作为服务提供给后继依赖SNMP的其他探针包，注册其知晓的资源
     *
     * @param modules MIB模块名称
     */
    void load(String... modules);

    /**
     * Print the mib structure of current repository
     * @param out the output stream
     */
    void print(PrintWriter out);
}
