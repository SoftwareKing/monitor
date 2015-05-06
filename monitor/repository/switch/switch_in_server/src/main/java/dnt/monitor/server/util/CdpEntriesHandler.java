package dnt.monitor.server.util;

import dnt.monitor.model.CdpEntry;
import net.happyonroad.util.GenericJsonHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * <h1>CDP Entries Handler</h1>
 *
 * @author Jay Xiong
 */
@MappedTypes(CdpEntry[].class)
public class CdpEntriesHandler extends GenericJsonHandler<CdpEntry[]> {

    @Override
    protected Class<CdpEntry[]> objectClass() {
        return CdpEntry[].class;
    }
}
