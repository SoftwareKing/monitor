package dnt.monitor.server.util;

import dnt.monitor.policy.MetricPolicy;
import net.happyonroad.util.GenericJsonHandler;

/**
 * <h1>The metric policies handler</h1>
 *
 * @author Jay Xiong
 */
public class MetricPoliciesHandler extends GenericJsonHandler<MetricPolicy[]> {
    @Override
    protected Class<MetricPolicy[]> objectClass() {
        return MetricPolicy[].class;
    }
}
