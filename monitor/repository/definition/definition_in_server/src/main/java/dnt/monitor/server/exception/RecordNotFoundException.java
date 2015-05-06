/**
 * Developer: Kadvin Date: 15/1/26 下午7:53
 */
package dnt.monitor.server.exception;

/**
 * 记录未找到的异常
 */
public class RecordNotFoundException extends RuntimeException{
    private static final long serialVersionUID = -1384897016381119830L;

    public RecordNotFoundException(String message) {
        super(message);
    }

}
