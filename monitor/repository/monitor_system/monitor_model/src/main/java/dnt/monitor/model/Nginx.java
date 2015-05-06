package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import net.happyonroad.util.StringUtils;

/**
 * <h1>Nginx Web Server</h1>
 *
 * 应该与apache，iis等归属为一类
 *
 * @author Jay Xiong
 */
@Category("nginx")
public class Nginx extends Application {
    private static final long serialVersionUID = 7826567917059579795L;

    public boolean hasUpstreamServer(String socketAddress) {
        //TODO 实际的判断逻辑是:
        //  nginx 的 upstream 中，有指向 monitor server http.port的server
        // 当下的判断逻辑为，只要其 host地址与nginx地址一致
        String hostAddress = StringUtils.substringBefore(socketAddress, ":");
        return StringUtils.equals(getHostAddress(), hostAddress);
    }
}
