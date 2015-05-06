package dnt.monitor.engine.support;

import dnt.monitor.engine.service.TriggerService;
import dnt.monitor.engine.util.BoundaryCronTrigger;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.Schedule;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.type.TimeSpan;
import net.happyonroad.util.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <h1>系统触发定时构建服务</h1>
 *
 * @author Jay Xiong
 */
@Component
class TriggerManager extends Bean implements TriggerService {
    //频度 -> 粒度的分组
    Map<TimeInterval, Granularity> granularities = new HashMap<TimeInterval, Granularity>();

    Granularity getGranularity(TimeInterval frequency){
        return getGranularity(frequency, 10);
    }

    void setGranularity(TimeInterval frequency, int granularity){
        int interval = (int)(frequency.getMilliseconds() / granularity);
        Granularity g = new Granularity((int)frequency.getMilliseconds(), interval);
        granularities.put(frequency, g);
    }

    Granularity getGranularity(TimeInterval frequency, int defaultGranularity){
        Granularity granularity = granularities.get(frequency);
        if( granularity == null ){
            setGranularity(frequency, defaultGranularity);
            granularity = granularities.get(frequency);
        }
        return granularity;
    }

    @Override
    public BoundaryCronTrigger create(TimeInterval frequency, Schedule schedule, TimeSpan window) {
        if (frequency.getMilliseconds() % 15 * DateUtils.MILLIS_PER_SECOND != 0) {
            throw new IllegalArgumentException(
                    "The frequency " + frequency + " can't be divided by system minimal interval(15s)");
        }
        int pos, val;
        String interval = frequency.getInterval();
        if (interval.contains("h")) {
            pos = 2;
            val = Integer.valueOf(interval.substring(0, interval.indexOf('h')));
        } else if (interval.contains("m")) {
            pos = 1;
            val = Integer.valueOf(interval.substring(0, interval.indexOf('m')));
        } else if (interval.contains("s")) {
            pos = 0;
            val = Integer.valueOf(interval.substring(0, interval.indexOf('s')));
        } else {
            throw new IllegalArgumentException("The interval " + interval + " is invalid, we only support h/m/s");
        }
        //如果连系统都没有设置默认的监控的频度，那么我们默认设置为所有时间
        String[] cron = schedule == null ? new String[]{"*", "*", "*", "*", "*", "*"} : schedule.getCron().split("\\s");
        Granularity granularity = getGranularity(frequency);
        //不同的频度，还需要削峰填谷
        //在频度之前的每个字段，先归置为0
        for (int i = 0; i < pos; i++) {
            cron[i] = granularity.getSegment(i);
        }
        //在小时这里，schedule和frequency的偏移量可能出现冲突
        // 原则是，保留 schedule的限制
        cron[pos] = granularity.getSegment(pos) + "/" + val;
        //向上计数，下个该间隔的计划自然向上偏移
        granularity.stepUp();
        String expression = StringUtils.join(cron, " ");
        BoundaryCronTrigger trigger = new BoundaryCronTrigger(expression);
        trigger.include(schedule);
        trigger.exclude(window);
        return trigger;
    }

    /**
     * <h1>粒度</h1>
     */
    static class Granularity{
        static Pattern[] patterns = new Pattern[] {
                Pattern.compile("(\\d+)s"),
                Pattern.compile("(\\d+)m"),
                Pattern.compile("(\\d+)h"),
        };
        //总周期
        private final int total;
        //划分后的间隔长度
        private final int interval;
        //当前的偏移量
        int currentOffset;


        public Granularity(int total, int interval) {
            this.total = total;
            this.interval = interval;
            this.currentOffset = 0;
        }

        public void stepUp() {
            this.currentOffset += interval;
            if( this.currentOffset >= total )
                this.currentOffset = 0;
        }

        @Override
        public String toString() {
            //返回形如: 30s/5m@2m30s，读作: 以30秒切割5分钟周期，当前偏移量为第2分钟30秒
            return TimeInterval.parse(interval) + "/" +
                   TimeInterval.parse(total) + "@" +
                   TimeInterval.parse(currentOffset);
        }

        /**
         * <h2>返回当前偏移量在特定cron位置上面的表达</h2>
         * @param i cron位置
         * @return 偏移量表达
         */
        public String getSegment(int i) {
            // 0(second):     1 (s)
            // 1(minute):    60 (s)
            // 2(hour)  : 36,00 (s)
            if( i > 2 )
                throw new UnsupportedOperationException("Can't support offset greater than hour");
            // 1h1m30s
            String offset = TimeInterval.parse(currentOffset);
            Pattern pattern = patterns[i];
            Matcher matcher = pattern.matcher(offset);
            if( matcher.find() ){
                return matcher.group(1);
            }else{
                return "0";
            }
        }
    }
}
