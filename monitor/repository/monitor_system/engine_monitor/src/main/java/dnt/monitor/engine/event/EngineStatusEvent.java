/**
 * Developer: Kadvin Date: 15/1/16 下午2:24
 */
package dnt.monitor.engine.event;

import org.springframework.context.ApplicationEvent;

/**
 * <h1>引擎状态变化事件</h1>
 * 在引擎范围内广播
 */
public class EngineStatusEvent extends ApplicationEvent {
    public EngineStatusEvent(Object session) {
        super(session);
    }
}
