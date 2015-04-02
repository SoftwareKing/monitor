/**
 * Developer: Kadvin Date: 14/12/28 下午4:20
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;

import java.util.Set;

/**
 * <h1>应用程序模型</h1>
 * 一般运行于某个主机上，与主机有运行于关系
 */
@Category("application")
public class Application extends Resource {
    private static final long serialVersionUID = 8048978953630217730L;
    // The host this application runs on
    //  应该有个 RunOn 的Link对象?
    private Host         host;
    // 安装目录
    private String       home;
    // 运行的进程pid集合
    private Set<Integer> pids;

    public Host getHost() {
        return host;
    }

    public void setHost(Host host) {
        this.host = host;
    }

    public String getHome() {
        return home;
    }

    public void setHome(String home) {
        this.home = home;
    }

    public Set<Integer> getPids() {
        return pids;
    }

    public void setPids(Set<Integer> pids) {
        this.pids = pids;
    }
}
