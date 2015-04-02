/**
 * Developer: Kadvin Date: 14/12/28 下午3:22
 */
package dnt.monitor.exception;

import net.happyonroad.exception.ServiceException;

/**
 * The resource layer exception
 */
public class ResourceException extends ServiceException {
    public ResourceException(String message) {
        super(message);
    }

    public ResourceException(String message, Throwable cause) {
        super(message, cause);
    }

    public ResourceException(Throwable cause) {
        super(cause);
    }

    public ResourceException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public ResourceException() {
    }
}
