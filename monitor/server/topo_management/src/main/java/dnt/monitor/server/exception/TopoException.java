/**
 * Developer: Kadvin Date: 15/1/12 下午1:58
 */
package dnt.monitor.server.exception;

import net.happyonroad.exception.ServiceException;

/**
 * Topo layer exception
 */
public class TopoException extends ServiceException {
    public TopoException() {
    }

    public TopoException(String message) {
        super(message);
    }

    public TopoException(String message, Throwable cause) {
        super(message, cause);
    }
}
