package dnt.monitor.policy;

import net.happyonroad.type.TimeInterval;

import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author Jay Xiong
 */
public class CompositeAlarmPolicy extends AlarmPolicy {
    private static final long serialVersionUID = -4511419543236720060L;
    //组成告警的多个事件信息
    private List<String> events;
    //事件需要在该事件段内相继产生
    private TimeInterval interval;

    public List<String> getEvents() {
        return events;
    }

    public void setEvents(List<String> events) {
        this.events = events;
    }

    public TimeInterval getInterval() {
        return interval;
    }

    public void setInterval(TimeInterval interval) {
        this.interval = interval;
    }
}
