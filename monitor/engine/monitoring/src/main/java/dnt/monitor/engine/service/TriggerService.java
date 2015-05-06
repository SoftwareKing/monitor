package dnt.monitor.engine.service;

import net.happyonroad.type.Schedule;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.type.TimeSpan;
import org.springframework.scheduling.Trigger;

/**
 * <h1>触发计划服务</h1>
 *
 * @author Jay Xiong
 */
public interface TriggerService {
    /**
     * <h2>将监控频度，监控计划和维护窗口转换为基于cron表达式的spring trigger</h2>
     * Spring的cron表达式支持秒，形式为: second, minute, hour, dayOfMonth, month, dayOfWeek
     *
     * @param frequency 监控频度，主要负责（时/分/秒）级别的频度控制
     *                  一般为 15s, 30m， 2h这种形态，不应该出现组合形式: 3m30s；（系统的最小轮询监控频度为15s)
     *                  如果出现组合形式，将会仅考虑第一个单位，后面的会被忽略
     *                  这里还会自动为同频度的任务进行削峰填谷，具体的算法为：将各个频度划分为n等份，偏移量为 0,n-1
     *                  不同频度的n可以由系统配置，默认为10
     * @param schedule  监控计划，其Cron部分主要负责（天/月/周) 级别的频度控制，其还负责控制监控的起始时间
     *                  一般情况下，主要在周上面做文章；也可能在时上面限定范围，如每天上午8:00到下午17:00之间
     *                  cron = * * 8-17 * * *
     * @param window    维护窗口，其主要在监控的起始时间内划出一段不进行监控的例外时间，以后增强之，可以划分出多段
     * @return Spring Trigger
     */
    Trigger create(TimeInterval frequency, Schedule schedule, TimeSpan window);

}
