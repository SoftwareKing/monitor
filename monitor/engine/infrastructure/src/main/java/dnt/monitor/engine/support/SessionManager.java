/**
 * Developer: Kadvin Date: 15/1/16 下午1:50
 */
package dnt.monitor.engine.support;


import dnt.monitor.engine.service.EngineServiceInvoker;
import dnt.monitor.engine.event.EngineConnectedEvent;
import dnt.monitor.engine.event.EngineDisconnectedEvent;
import dnt.monitor.engine.event.EngineStatusEvent;
import net.happyonroad.event.SystemEvent;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.type.TimeInterval;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.jetty.JettyWebSocketClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

/**
 * <h1>Web Socket Session Manager</h1>
 */
@Component
class SessionManager extends ApplicationSupportBean
        implements ApplicationListener<SystemEvent>, Runnable {
    static PasswordEncoder encoder = new StandardPasswordEncoder();

    @Autowired
    EngineServiceInvoker invoker;

    @Value("${server.address}")
    private String  serverAddress;
    @Value("${server.port}")
    private Integer serverPort;

    private TimeInterval tryInterval;

    private SockJsClient sockJsClient;

    private Thread           workThread;
    private WebSocketSession session;


    @Override
    public void onApplicationEvent(SystemEvent event) {
        if (event instanceof SystemStartedEvent) {
            startSelf();
        } else {
            //System Stopping
            stopSelf();
        }
    }

    protected void startSelf() {
        tryInterval = new TimeInterval(System.getProperty("session.setup.interval", "30s"));

        List<Transport> transports = new ArrayList<Transport>(2);
        transports.add(new WebSocketTransport(new JettyWebSocketClient()));

        sockJsClient = new SockJsClient(transports);
        sockJsClient.start();

        stopConnecting();
        startConnecting();
    }

    void startConnecting() {
        workThread = new Thread(this, "SessionSetup");
        workThread.start();
    }

    void stopConnecting() {
        if (workThread != null && workThread.isAlive()) {
            try {
                //等待线程正常退出
                //经过等待时间还没有正常退出，那就中断之
                workThread.interrupt();
            } catch (Exception e) {
                //skip
            }
        }
    }


    @Bean
    public WebSocketHandler webSocketHandler() {
        return new EngineWebSocketHandler(invoker, this);
    }


    @Bean
    EngineEventListener engineEventListener() {
        return new EngineEventListener();
    }

    protected void stopSelf() {
        if (sockJsClient != null && sockJsClient.isRunning()) {
            sockJsClient.stop();
        }
    }

    @Override
    public void run() {
        logger.info("Session setup started");
        //存在一个重复会话的可能性；
        // 当注册会话timeout的时候（譬如服务器被阻塞）
        // 这里会得到 TimeoutException，休息一会儿，就会又再次尝试建立新会话
        // 而服务器这边会重复接到所有的会话，等服务器缓过神来之后，所有的会话都建立成功了
        // 这个问题需要在两边都处理
        // 在引擎端的处理策略大概是这样：
        //  SessionSetup线程和EngineWebSocket线程通过某种机制共享一个锁
        //  EngineWebSocket在Session setup/closed的时候释放这个锁
        //  而SessionSetup在发出请求之前需要申请这个锁/请求发出之后，释放这个锁
        // 不过，以上锁的机制貌似是现有代码问题多出来的烦恼，只要get future forever就不会出现这个问题了
        String result;
        do {
            try {
                session = null;
                URI uri = fromUriString("ws://{0}:{1}/south").buildAndExpand(serverAddress, serverPort).encode().toUri();
                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.set("Authorization", authorization());
                WebSocketHttpHeaders headers = new WebSocketHttpHeaders(httpHeaders);
                ListenableFuture<WebSocketSession> future = sockJsClient.doHandshake(webSocketHandler(), headers, uri);
                session = future.get();
                result = session.getId();
            } catch (Throwable e) {
                if (session == null) {
                    result = ExceptionUtils.getRootCauseMessage(e);
                    //有可能已经建立连接，譬如，本线程被成功线程打断
                } else {
                    result = session.toString();
                }
                rest((int) tryInterval.getMilliseconds());
            }
            logger.info("Setup connection to server {}", result);
        } while (this.isRunning() && session == null);
        logger.info("Session setup finished with {}", result);
    }

    //TODO 根据对 web socket 的了解，底层 SocketJs 已经有了heart beat机制
    // 只是底层的 heart beat机制没有被上层听到，更新session对象的updatedAt
    // 如果采用STOMP协议，也是有更高级别的 heart beat机制

    private class EngineEventListener implements ApplicationListener<EngineStatusEvent> {
        @Override
        public void onApplicationEvent(EngineStatusEvent event) {
            if (event instanceof EngineConnectedEvent) {
                SessionManager.this.session = (WebSocketSession) event.getSource();
                stopConnecting();
            } else if (event instanceof EngineDisconnectedEvent) {
                stopConnecting();
                startConnecting();
            }
        }
    }

    private String authorization() {
        String raw = getEngineId() + ":" + encodePassword(getApiToken());
        return "Basic " + new String(Base64.encode(raw.getBytes()));
    }


    private String encodePassword(String apiToken) {
        return encoder.encode(apiToken);
    }

    String getEngineId() {
        return System.getProperty("engine.id");
    }

    String getApiToken() {
        return System.getProperty("engine.apiToken");
    }
}
