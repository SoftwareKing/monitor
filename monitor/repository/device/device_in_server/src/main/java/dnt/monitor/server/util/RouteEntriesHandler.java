/**
 * Developer: Kadvin Date: 15/3/5 下午1:27
 */
package dnt.monitor.server.util;

import dnt.monitor.model.RouteEntry;
import net.happyonroad.util.GenericJsonHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * <h1>Route Entries Handler</h1>
 */
@MappedTypes(RouteEntry[].class)
public class RouteEntriesHandler extends GenericJsonHandler<RouteEntry[]> {

    @Override
    protected Class<RouteEntry[]> objectClass() {
        return RouteEntry[].class;
    }
}
