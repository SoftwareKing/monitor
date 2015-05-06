/**
 * Developer: Kadvin Date: 15/1/16 下午2:32
 */
package dnt.monitor.engine.event;

/**
 * <h1>Engine Disconnected event</h1>
 */
public class EngineDisconnectedEvent extends EngineStatusEvent {
    public EngineDisconnectedEvent(Object session) {
        super(session);
    }
}
