package dnt.monitor.policy;

/**
 * <h1>基于特定事件的告警定义</h1>
 *
 * @author Jay Xiong
 */
public class SimpleAlarmPolicy extends AlarmPolicy{
    private static final long serialVersionUID = -4998358460126524010L;
    //事件定义，TODO 到底如何定义，有待厘清
    private String event;

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }
}
