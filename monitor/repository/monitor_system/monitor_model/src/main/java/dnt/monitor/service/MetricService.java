/**
 * Developer: Kadvin Date: 15/2/15 下午7:58
 */
package dnt.monitor.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.MetricValues;

/**
 * <h1>指标服务</h1>
 * <p/>
 * 在资源策略说明特定对象的组件需要指标记录时，
 * 例如，规则可能表达：
 * <ul>
 * <li>主机的总体CPU需要记录，但各个具体的CPU并不需要记录
 * <li>Windows主机的系统分区(C:\)需要记录，但其他分区(D:\, E:\...)不需要记录
 * <li>网络交换机的上行端口(WAN)口流量指标需要记录，但其他下行端口(LAN)口流量不需要记录
 * <li>Oracle数据库业务表空间需要记录各种指标，但其他表空间不需要
 * <li>特定资源自身的指标需要记录
 * </ul>
 * 监控引擎会以组件(传统的指标组)为单位，记录被监控资源的指标数据
 * (当指标附着在资源本身时，该资源对象充当类似于组件的功能)
 * <p/>
 * <p/>
 * 监控引擎将采用RRD技术记录各种指标
 * 而本服务的内容（仅从监控服务器的视角，不包括内部实现），也如同rrd能够提供的服务，包括两种：
 * <p/>
 * <ul>
 * <li>rrd 数据服务(rrdtool fetch)
 * <li>rrd 图形服务(rrdtool graph)
 * </ul>
 * <p/>
 * 从使用者的角度考虑，主要分为以下两种情况：
 * <ul>
 * <li>实时指标浏览：当用户发起实时指标浏览时，需要通过该通道获取相应组件最近一段时间
 * （如监控频度为1分钟，获取最近20分钟的记录数据）
 * <li>历史指标浏览(2天/1周/1月/1年)：该历史指标应该被转储在监控服务器上
 * </ul>
 * 监控引擎仅有特定指标组的有限数据集（如最近1年/1月/1周/1天的指标数据)
 * 而上月/上周/每天的数据集，应该由监控服务器进行汇总，决定存储还是不存储
 */
public interface MetricService {
    /**
     * <h2>读取某个资源(path)下的特定组件(component)或对象的最近若干时间内的实时采集数据</h2>
     *
     * @param path       资源+组件的管理路径，如果仅仅是资源，则其path形如: /default/group1/dev1
     *                   如果需要定位到组件，则其path形如: /default/group1/dev1#CPU_0
     * @param funcName   RRD聚合函数名称，如AVERAGE
     * @param fetchStart 抓取的开始时间点
     * @param fetchEnd   抓取的结束时间点
     * @param resolution 分辨率
     * @return 抓取到的数据
     */
    MetricValues fetch(String path, String funcName,
                       long fetchStart, long fetchEnd, long resolution)
            throws EngineException;
}
