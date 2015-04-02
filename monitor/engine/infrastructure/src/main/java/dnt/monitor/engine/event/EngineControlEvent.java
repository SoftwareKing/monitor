/**
 * Developer: Kadvin Date: 15/3/12 上午11:26
 */
package dnt.monitor.engine.event;

import org.springframework.context.ApplicationEvent;

/**
 * <h1>引擎控制事件</h1>
 * 包括：
 * <ul>
 * <li>Approved</li>
 * <li>Rejected</li>
 * <li>Request to Restart</li>
 * <li>Request to Stop</li>
 * <li>...</li>
 * </ul>
 */
public class EngineControlEvent extends ApplicationEvent {
    public EngineControlEvent(Object source) {
        super(source);
    }
}
