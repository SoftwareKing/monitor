/**
 * Developer: Kadvin Date: 15/3/12 下午3:35
 */
package dnt.monitor.server.exception;

import net.happyonroad.exception.ServiceException;

/**
 * <h1>执行发现时可能抛出的异常</h1>
 */
public class DiscoveryException extends ServiceException{
    public DiscoveryException(String message, Throwable e) {
        super(message, e);
    }
}
