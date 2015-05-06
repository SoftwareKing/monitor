package dnt.monitor.engine.exception;

import dnt.monitor.exception.SampleException;

/**
 * <h1>Wbem Exception</h1>
 *
 * @author Jay Xiong
 */
public class WbemException extends SampleException {

    public WbemException(String message) {
        super(message);
    }

    public WbemException(Exception cause) {
        super(cause);
    }

    public WbemException(String message, Exception cause) {
        super(message, cause);
    }
}
