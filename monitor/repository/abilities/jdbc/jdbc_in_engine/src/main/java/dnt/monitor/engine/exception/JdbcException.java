package dnt.monitor.engine.exception;

import dnt.monitor.exception.SampleException;

/**
 * <h1>JDBC Exception</h1>
 *
 * @author Jay Xiong
 */
public class JdbcException extends SampleException {
    private static final long serialVersionUID = 4085283989921476602L;
    private int errorCode;

    public JdbcException(int errorCode, String message, Exception cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public JdbcException(int errorCode, String message) {
        this(errorCode, message, null);
    }

    public JdbcException(int errorCode, Exception cause) {
        this(errorCode, null, cause);
    }

    public int getErrorCode() {
        return errorCode;
    }
}
