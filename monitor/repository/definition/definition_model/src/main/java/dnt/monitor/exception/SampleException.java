package dnt.monitor.exception;

import dnt.monitor.exception.EngineException;

/**
 * <h1>采集异常</h1>
 *
 * @author Jay Xiong
 */
public class SampleException extends EngineException {
    public SampleException(String message) {
        super(message);
    }

    public SampleException(Exception cause) {
        super(cause);
    }

    public SampleException(String message, Exception cause) {
        super(message, cause);
    }
}
