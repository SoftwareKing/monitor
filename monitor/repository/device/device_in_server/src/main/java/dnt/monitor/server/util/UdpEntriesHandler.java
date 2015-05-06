/**
 * Developer: Kadvin Date: 15/3/5 下午1:27
 */
package dnt.monitor.server.util;

import dnt.monitor.model.UdpEntry;
import net.happyonroad.util.GenericJsonHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * <h1>Udp Entries Handler</h1>
 */
@MappedTypes(UdpEntry[].class)
public class UdpEntriesHandler extends GenericJsonHandler<UdpEntry[]> {

    @Override
    protected Class<UdpEntry[]> objectClass() {
        return UdpEntry[].class;
    }
}
