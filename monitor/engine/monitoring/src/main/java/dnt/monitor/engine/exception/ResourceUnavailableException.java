package dnt.monitor.engine.exception;

import dnt.monitor.engine.util.MonitoringExecutor;
import net.happyonroad.type.TimeInterval;

/**
 * <h1>资源不可用的异常</h1>
 *
 * @author Jay Xiong
 */
public class ResourceUnavailableException extends MonitoringException {
    private static final long serialVersionUID = -7428459995347182868L;
    private final long cost;

    public ResourceUnavailableException(MonitoringExecutor executor, long cost) {
        super(executor, "Can't visit " + executor.getResource() + ", take " + TimeInterval.parse(cost) + " to try");
        this.cost = cost;
    }

    public ResourceUnavailableException(MonitoringExecutor executor, long cost, Exception cause) {
        super(executor, cause);
        this.cost = cost;
    }

    public long getCost() {
        return cost;
    }
}
