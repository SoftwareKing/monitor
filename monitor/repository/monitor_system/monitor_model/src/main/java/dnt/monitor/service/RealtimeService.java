/**
 * Developer: Kadvin Date: 15/2/15 下午7:40
 */
package dnt.monitor.service;

import dnt.monitor.exception.EngineException;
import org.apache.commons.collections.Predicate;
import org.joda.time.Period;

/**
 * <h1>实时采集对象信息的控制接口</h1>
 *
 * 需要基于引擎在线会话工作
 */
public interface RealtimeService {

    /**
     * <h2>开始一个实时监控任务</h2>
     *
     * @param nodePath 被实时监控的对象路径
     * @param period   实时监控的频度，如果其频度超过了最高频度，则会收到无法启动的即时反馈
     * @param filter   需要实时监控的对象过滤器，基于资源的组件实例进行过滤
     * @return 任务编号
     */
    String startRealtime(String nodePath, Period period, Predicate filter)throws EngineException;

    /**
     * <h2>让某个实时监测任务保持活跃</h2>
     * 为了避免调用者挂掉，而导致实时监控任务始终得不到撤销，要求实时监测的发起者，每过若干秒(一般是1分钟)
     * 针对该任务发起keepLiving调用，否则，系统监测到任务经过2-3个keepLiving周期之后还没有被keep，则会自动停止
     *
     * @param realtimeId 实时任务序号
     * @return 如果任务已经fail，则返回false；如果任务尚未开始，或者还在执行中，则返回true
     */
    boolean keepLiving(String realtimeId)throws EngineException;

    /**
     * <h2>结束一个实时监控任务</h2>
     *
     * @param realtimeId 生成的实时监控任务序号
     */
    void stopRealtime(String realtimeId)throws EngineException;
}
