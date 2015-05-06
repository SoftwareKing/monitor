package dnt.monitor.engine.exception;

import dnt.monitor.exception.SampleException;

/**
 * <h1>WMI Exception</h1>
 *
 * @author Jay Xiong
 */
public class WmiException extends SampleException {
    private static final long serialVersionUID = -7535487856600002663L;

    public WmiException(String message) {
        super(message);
    }

    public WmiException(Exception cause) {
        super(cause);
    }

    public WmiException(String message, Exception cause) {
        super(message, cause);
    }
}
