package dnt.monitor.exception;

import net.happyonroad.exception.ServiceException;

/**
 * <h1>策略异常</h1>
 *
 * @author Jay Xiong
 */
public class PolicyException extends ServiceException {
    private static final long serialVersionUID = -5952906683322066613L;

    public PolicyException(String message) {
        super(message);
    }

    public PolicyException(String message, Throwable cause) {
        super(message, cause);
    }

    public PolicyException(Throwable cause) {
        super(cause);
    }

    public PolicyException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public PolicyException() {
    }
}
