package dnt.monitor.engine.exception;

import dnt.monitor.engine.util.MonitoringExecutor;

/**
 * <h1>监控过程中碰到的异常</h1>
 *
 * @author Jay Xiong
 */
public class MonitoringException extends RuntimeException{
    private static final long serialVersionUID = 6350692654884860750L;
    private final MonitoringExecutor executor;

    public MonitoringException(MonitoringExecutor executor, String message) {
        super(message);
        this.executor  = executor;
    }

    public MonitoringException(MonitoringExecutor executor, Exception cause) {
        super(cause);
        this.executor = executor;
    }

    public MonitoringExecutor getExecutor() {
        return executor;
    }
}
