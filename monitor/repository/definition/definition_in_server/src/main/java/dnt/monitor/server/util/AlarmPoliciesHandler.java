package dnt.monitor.server.util;

import dnt.monitor.policy.AlarmPolicy;
import net.happyonroad.util.GenericJsonHandler;

/**
 * <h1>The alarm policies handler</h1>
 *
 * @author Jay Xiong
 */
public class AlarmPoliciesHandler extends GenericJsonHandler<AlarmPolicy[]> {
    @Override
    protected Class<AlarmPolicy[]> objectClass() {
        return AlarmPolicy[].class;
    }
}
