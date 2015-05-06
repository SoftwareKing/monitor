package dnt.monitor.engine.exception;

import dnt.monitor.engine.util.MonitoringExecutor;
import net.happyonroad.type.TimeInterval;

/**
 * <h1>监控频度过高的异常</h1>
 *
 * @author Jay Xiong
 */
public class MonitoringTooOftenException extends MonitoringException {
    private static final long serialVersionUID = -4303204892008748305L;
    private final long         cost;
    private final TimeInterval interval;

    public MonitoringTooOftenException(MonitoringExecutor executor, long cost, TimeInterval interval) {
        super(executor, "The real cost (" + TimeInterval.parse(cost) + ") is more than interval " + interval);
        this.cost = cost;
        this.interval = interval;
    }

    public long getCost() {
        return cost;
    }

    public TimeInterval getInterval() {
        return interval;
    }
}
