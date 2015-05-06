package dnt.monitor.engine.exception;

import dnt.monitor.exception.EngineException;

/**
 * <h1>The discovery exception occurred in engine side</h1>
 *
 * @author Jay Xiong
 */
public class DiscoveryException extends EngineException {
    public DiscoveryException(String message) {
        super(message);
    }

    public DiscoveryException(Exception cause) {
        super(cause);
    }

    public DiscoveryException(String message, Exception cause) {
        super(message, cause);
    }
}
