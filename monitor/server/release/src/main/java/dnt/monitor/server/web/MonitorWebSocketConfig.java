/**
 * Developer: Kadvin Date: 15/1/29 下午2:05
 */
package dnt.monitor.server.web;

import net.happyonroad.component.core.ComponentContext;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.platform.web.util.DelegateWebSocketHandler;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurationSupport;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

/**
 * <h1>配置Monitor的WebSocket特性</h1>
 */
@Configuration
@EnableWebSocket
public class MonitorWebSocketConfig extends WebSocketConfigurationSupport
        implements WebSocketConfigurer, ApplicationListener<SystemStartedEvent> {

    private DelegateWebSocketHandler southDelegate, northDelegate;


    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        southDelegate = new DelegateWebSocketHandler();
        northDelegate = new DelegateWebSocketHandler();
        registry.addHandler(southDelegate, "/south")
                .addInterceptors(new HttpSessionHandshakeInterceptor()).withSockJS();

        registry.addHandler(northDelegate, "/north")
                .addInterceptors(new HttpSessionHandshakeInterceptor()).withSockJS();

    }

    // 系统完全启动之后，再通过服务注册表获取到应用层的实现的相关服务
    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        ComponentContext context = event.getSource();
        // 让实现包将 south/north handler 作为服务暴露出来
        // 这里就不需要直接通过其application context去寻找
        // 这样，就可以不关注 这些 handler是哪个组件构建的
        WebSocketHandler southHandler = context.getRegistry().getService(WebSocketHandler.class, "south");
        southDelegate.setDelegate(southHandler);
        WebSocketHandler northHandler = context.getRegistry().getService(WebSocketHandler.class, "north");
        northDelegate.setDelegate(northHandler);
    }
}
