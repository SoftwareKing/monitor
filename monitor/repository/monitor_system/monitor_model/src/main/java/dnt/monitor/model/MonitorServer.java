/**
 * Developer: Kadvin Date: 14/12/23 下午4:36
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;

/**
 * Monitor Server
 */
@Category("monitor_server")
public class MonitorServer extends Application{
    private static final long serialVersionUID = 1894630831460403119L;

    public MonitorServer() {
        setType("/application/monitor_server");
    }
}
