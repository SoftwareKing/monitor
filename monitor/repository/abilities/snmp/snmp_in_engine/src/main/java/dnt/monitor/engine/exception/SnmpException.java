package dnt.monitor.engine.exception;

import dnt.monitor.exception.SampleException;

/**
 * <h1>The SNMP Exception</h1>
 *
 * @author Jay Xiong
 */
public class SnmpException extends SampleException {
    private static final long serialVersionUID = 7316547962803661304L;
    private int errorCode;

    public SnmpException(int errorCode, String message, Exception cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public SnmpException(int errorCode, String message) {
        this(errorCode, message, null);
    }

    public SnmpException(int errorCode, Exception cause) {
        this(errorCode, null, cause);
    }

    public int getErrorCode() {
        return errorCode;
    }
}
