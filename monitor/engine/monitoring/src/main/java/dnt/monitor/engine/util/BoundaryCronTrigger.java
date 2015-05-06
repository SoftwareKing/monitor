package dnt.monitor.engine.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import net.happyonroad.type.TimeSpan;
import org.springframework.scheduling.TriggerContext;
import org.springframework.scheduling.support.CronTrigger;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * <h1>Boundary Cron Trigger</h1>
 * <p/>
 * 有include/exclude边界的Cron Trigger
 *
 * @author Jay Xiong
 */
public class BoundaryCronTrigger extends CronTrigger {
    static SimpleDateFormat format = new SimpleDateFormat("hh:mm:ss");

    /* 开始结束的时间窗口*/
    TimeSpan include;
    /* 排除的时间窗口 */
    TimeSpan exclude;

    /**
     * <h2>构建一个有边界,有排除窗口,可外部控制的Cron Trigger</h2>
     *
     * @param cron cron 表达式，不同于Linux，可以控制到秒级: second, minute, hour, day, month, weekday
     */
    @JsonCreator
    public BoundaryCronTrigger(String cron) {
        super(cron);
    }

    public TimeSpan getInclude() {
        return include;
    }

    public TimeSpan getExclude() {
        return exclude;
    }

    public void include(TimeSpan window) {
        this.include = window;
    }

    public void exclude(TimeSpan window) {
        this.exclude = window;
    }


    @Override
    public Date nextExecutionTime(TriggerContext triggerContext) {
        Date date = triggerContext.lastCompletionTime();
        if (date != null) {
            Date scheduled = triggerContext.lastScheduledExecutionTime();
            if (scheduled != null && date.before(scheduled)) {
                // Previous task apparently executed too early...
                // Let's simply use the last calculated execution time then,
                // in order to prevent accidental re-fires in the same second.
                date = scheduled;
            }
        } else {
            date = new Date();
        }
        long time = date.getTime();
        // 判断是否在开始/结束时间之外
        if (getInclude() != null && !getInclude().include(time))
            return null;
        // 判断是否在排除时间之内
        if (getExclude() != null && getExclude().include(time))
            return null;
        return super.nextExecutionTime(triggerContext);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BoundaryCronTrigger)) return false;
        if (!super.equals(o)) return false;

        BoundaryCronTrigger that = (BoundaryCronTrigger) o;

        if (include != null ? !include.equals(that.include) : that.include != null) return false;
        if (exclude != null ? !exclude.equals(that.exclude) : that.exclude != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (include != null ? include.hashCode() : 0);
        result = 31 * result + (exclude != null ? exclude.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "BoundaryCronTrigger(" +
               (include == null ? "" : "include=" + include + ",")+
               (exclude == null ? "" : "exclude=" + exclude + ",")+
               "cron=" + getExpression()+ ')';
    }

}
