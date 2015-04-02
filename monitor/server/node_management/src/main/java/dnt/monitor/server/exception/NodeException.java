/**
 * Developer: Kadvin Date: 14/12/28 下午3:23
 */
package dnt.monitor.server.exception;

import net.happyonroad.exception.ServiceException;

/**
 * The managed node exception
 */
public class NodeException extends ServiceException {
    public NodeException() {
    }

    public NodeException(String message) {
        super(message);
    }

    public NodeException(String message, Throwable cause) {
        super(message, cause);
    }

    public NodeException(Throwable cause) {
        super(cause);
    }

    public NodeException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
