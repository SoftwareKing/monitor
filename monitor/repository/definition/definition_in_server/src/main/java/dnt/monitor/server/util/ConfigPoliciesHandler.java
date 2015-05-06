package dnt.monitor.server.util;

import dnt.monitor.policy.ConfigPolicy;
import net.happyonroad.util.GenericJsonHandler;

/**
 * <h1>The config policies handler</h1>
 *
 * @author Jay Xiong
 */
public class ConfigPoliciesHandler extends GenericJsonHandler<ConfigPolicy[]> {
    @Override
    protected Class<ConfigPolicy[]> objectClass() {
        return ConfigPolicy[].class;
    }
}
