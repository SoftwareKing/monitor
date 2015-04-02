/**
 * Developer: Kadvin Date: 15/2/4 下午4:37
 */
package dnt.monitor.exception;

import net.happyonroad.exception.ServiceException;

/**
 * <h1>元模型异常</h1>
 */
@SuppressWarnings("UnusedDeclaration")
public class MetaException extends ServiceException {
    public MetaException(String message) {
        super(message);
    }

    public MetaException(String message, Throwable cause) {
        super(message, cause);
    }

    public MetaException(Throwable cause) {
        super(cause);
    }

    public MetaException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public MetaException() {
    }
}
