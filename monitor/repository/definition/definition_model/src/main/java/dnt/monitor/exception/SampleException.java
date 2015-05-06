package dnt.monitor.exception;

/**
 * <h1>采集异常</h1>
 *
 * @author Jay Xiong
 */
public class SampleException extends EngineException {
    private static final long serialVersionUID = -2845975857628694942L;

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
