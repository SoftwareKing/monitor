/**
 * Developer: Kadvin Date: 15/1/16 下午2:32
 */
package dnt.monitor.engine.event;

/**
 * <h1>Engine Connected event</h1>
 */
public class EngineConnectedEvent extends EngineStatusEvent {
    public EngineConnectedEvent(Object session) {
        super(session);
    }
}
