/**
 * Developer: Kadvin Date: 14/12/23 下午4:36
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;

/**
 * <h1>Monitor Agent</h1>
 *
 * 运行在被监控主机上的监控代理
 */
@Category("agent")
public class MonitorAgent extends MonitorApplication{

    private static final long serialVersionUID = -2949807033094849798L;

    public MonitorAgent() {
        setType("/app/jvm/monitor/agent");
    }
}
