/**
 * Developer: Kadvin Date: 15/3/5 下午1:27
 */
package dnt.monitor.server.util;

import dnt.monitor.model.AddressEntry;
import net.happyonroad.util.GenericJsonHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * <h1>AddressEntries Handler</h1>
 */
@MappedTypes(AddressEntry[].class)
public class AddressEntriesHandler extends GenericJsonHandler<AddressEntry[]> {

    @Override
    protected Class<AddressEntry[]> objectClass() {
        return AddressEntry[].class;
    }
}
