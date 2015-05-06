/**
 * Developer: Kadvin Date: 14/12/28 下午4:20
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dnt.monitor.annotation.Category;
import net.happyonroad.util.StringUtils;

import java.util.Set;

/**
 * <h1>应用程序模型</h1>
 * 一般运行于某个主机上，与主机有运行于关系
 */
@Category("app")
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

    /**
     * <h2>得到应用程序的主机地址</h2>
     * 应用程序的地址一般为主机地址+端口号
     * 如果不是这个规则，应用程序的子类应该override本方法
     *
     * @return 主机地址
     */
    @JsonIgnore
    public String getHostAddress() {
        return StringUtils.substringBefore(getAddress(), ":");
    }

    @JsonIgnore
    public String getPort() {
        return StringUtils.substringAfter(getAddress(), ":");
    }
}
