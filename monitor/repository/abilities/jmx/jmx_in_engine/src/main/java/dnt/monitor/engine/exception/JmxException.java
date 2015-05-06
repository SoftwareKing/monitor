package dnt.monitor.engine.exception;

import dnt.monitor.exception.SampleException;

/**
 * <h1>JMX Exception</h1>
 *
 * @author Jay Xiong
 */
public class JmxException extends SampleException {
    private static final long serialVersionUID = 2472815730889148287L;

    public JmxException(String message) {
        super(message);
    }

    public JmxException(Exception cause) {
        super(cause);
    }

    public JmxException(String message, Exception cause) {
        super(message, cause);
    }
}
