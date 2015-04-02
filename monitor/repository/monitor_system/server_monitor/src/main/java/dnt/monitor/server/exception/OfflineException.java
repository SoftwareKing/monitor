/**
 * Developer: Kadvin Date: 15/2/16 下午4:36
 */
package dnt.monitor.server.exception;

import dnt.monitor.exception.EngineException;

/**
 * <h1>对离线的引擎发起调用时，抛出的异常</h1>
 *
 * 虽然会抛出该异常，但调用消息还是会被发送给相应的引擎，对应的引擎在线之后，会收到相应的调用消息，并予以执行
 */
public class OfflineException extends EngineException {
    public OfflineException(String message) {
        super(message);
    }
}
