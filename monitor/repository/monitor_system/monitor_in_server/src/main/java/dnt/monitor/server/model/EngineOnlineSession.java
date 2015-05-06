/**
 * Developer: Kadvin Date: 15/1/21 上午11:30
 */
package dnt.monitor.server.model;

import dnt.monitor.model.MonitorEngine;
import org.apache.commons.lang.StringUtils;
import org.eclipse.jetty.util.FuturePromise;
import org.springframework.security.core.Authentication;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * <h1>The engine session in Monitor Server</h1>
 * TODO 考虑将这个web socket的消息和回应封装成为一个高层的api调用
 */
public class EngineOnlineSession extends EngineSession{
    private final Authentication   authentication;
    private       WebSocketSession session;
    private Map<String, FuturePromise<String>> futures;

    public EngineOnlineSession(MonitorEngine engine, WebSocketSession session, Authentication authenticated) {
        super(engine);
        update(session);
        this.authentication = authenticated;
        futures = new HashMap<String, FuturePromise<String>>();
    }

    public void handle(String payload) {
        logger.debug("Handle {}", payload);
        // payload like : UUID[36]@response
        String replyTo = payload.substring(0, 36);
        String response = payload.substring(37);
        FuturePromise<String> promise = futures.get(replyTo);
        if( promise != null ){
            promise.succeeded(response);
        }else{
            logger.debug("Caller timeout, discard the response {}", response);
        }
        updated();
    }

    public void update(WebSocketSession session) {
        this.session = session;
        updated();
    }

    public String getEngineId() {
        return authentication.getName();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "engineId=" + getEngineId() +
                ",sessionId=" +  session.getId() +
                ",authorities=" + StringUtils.join(authentication.getAuthorities(), ",") +
                ")";
    }

    @Override
    public void sendMessage(String task) throws IOException {
        logger.debug("Sending {} to {}", StringUtils.abbreviate(task, 100), getEngine());
        this.session.sendMessage(new TextMessage(task));
        logger.debug("Sent    {} to {}", StringUtils.abbreviate(task, 100), getEngine());
    }

    @Override
    public String waitMessage(String replyId, int timeout)
            throws InterruptedException, ExecutionException, TimeoutException {
        FuturePromise<String> future = new FuturePromise<String>();
        try {
            futures.put(replyId, future);
            return future.get(timeout, TimeUnit.MILLISECONDS);
        } finally {
            futures.remove(replyId);
        }
    }
}
