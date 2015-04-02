/**
 * Developer: Kadvin Date: 15/1/21 下午2:12
 */
package dnt.monitor.exception;

/**
 * <h1>引擎端发出的异常</h1>
 */
public class EngineException extends ResourceException {
    public EngineException(String message) {
        super(message);
    }

    public EngineException(Exception cause) {
        super(cause);
    }

    public EngineException(String message, Exception cause) {
        super(message, cause);
    }
}
