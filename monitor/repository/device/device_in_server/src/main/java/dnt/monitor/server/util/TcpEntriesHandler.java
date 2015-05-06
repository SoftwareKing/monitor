/**
 * Developer: Kadvin Date: 15/3/5 下午1:27
 */
package dnt.monitor.server.util;

import dnt.monitor.model.TcpEntry;
import net.happyonroad.util.GenericJsonHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * <h1>Tcp Entries Handler</h1>
 */
@MappedTypes(TcpEntry[].class)
public class TcpEntriesHandler extends GenericJsonHandler<TcpEntry[]> {

    @Override
    protected Class<TcpEntry[]> objectClass() {
        return TcpEntry[].class;
    }
}
