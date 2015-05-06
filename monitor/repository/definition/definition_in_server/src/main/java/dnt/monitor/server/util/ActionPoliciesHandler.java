package dnt.monitor.server.util;

import dnt.monitor.policy.ActionPolicy;
import net.happyonroad.util.GenericJsonHandler;

/**
 * <h1>The action policies handler</h1>
 *
 * @author Jay Xiong
 */
public class ActionPoliciesHandler extends GenericJsonHandler<ActionPolicy[]> {
    @Override
    protected Class<ActionPolicy[]> objectClass() {
        return ActionPolicy[].class;
    }
}
