/**
 * Developer: Kadvin Date: 15/3/12 上午11:25
 */
package dnt.monitor.engine.event;

/**
 * <h1>当引擎被批准时，发出该事件</h1>
 */
public class EngineRejectedEvent extends EngineControlEvent {
    public EngineRejectedEvent(Object source) {
        super(source);
    }
}
