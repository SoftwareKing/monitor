/**
 * Developer: Kadvin Date: 15/3/5 下午1:27
 */
package dnt.monitor.server.util;

import dnt.monitor.model.ARPEntry;
import net.happyonroad.util.GenericJsonHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * <h1>ARPEntries Handler</h1>
 */
@MappedTypes(ARPEntry[].class)
public class ARPEntriesHandler extends GenericJsonHandler<ARPEntry[]> {

    @Override
    protected Class<ARPEntry[]> objectClass() {
        return ARPEntry[].class;
    }
}
