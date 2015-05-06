package dnt.monitor.server.util;

import dnt.monitor.policy.NotificationPolicy;
import net.happyonroad.util.GenericJsonHandler;

/**
 * <h1>The notification policies handler</h1>
 *
 * @author Jay Xiong
 */
public class NotificationPoliciesHandler extends GenericJsonHandler<NotificationPolicy[]> {
    @Override
    protected Class<NotificationPolicy[]> objectClass() {
        return NotificationPolicy[].class;
    }
}
