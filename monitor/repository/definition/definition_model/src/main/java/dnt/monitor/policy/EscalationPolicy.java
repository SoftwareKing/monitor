package dnt.monitor.policy;

import net.happyonroad.type.TimeInterval;

/**
 * <h1>通知升级的策略</h1>
 *
 * @author Jay Xiong
 */
public class EscalationPolicy extends NotificationPolicy {
    private static final long serialVersionUID = -3478352415102275706L;
    //告警的延续时间，也就是这么长时间没有自动恢复
    private TimeInterval restoreDuration;
    //在若干时间内，发生若干次数
    private TimeInterval occurrenceDuration;
    //这2个属性需要配合发生作用
    private int          occurrences;

    public TimeInterval getRestoreDuration() {
        return restoreDuration;
    }

    public void setRestoreDuration(TimeInterval restoreDuration) {
        this.restoreDuration = restoreDuration;
    }

    public TimeInterval getOccurrenceDuration() {
        return occurrenceDuration;
    }

    public void setOccurrenceDuration(TimeInterval occurrenceDuration) {
        this.occurrenceDuration = occurrenceDuration;
    }

    public int getOccurrences() {
        return occurrences;
    }

    public void setOccurrences(int occurrences) {
        this.occurrences = occurrences;
    }
}
