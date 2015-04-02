/**
 * Developer: Kadvin Date: 15/2/16 下午3:33
 */
package dnt.monitor.engine.service;

import org.springframework.web.socket.WebSocketSession;

/**
 * <h1>Engine Service Invoker</h1>
 */
public interface EngineServiceInvoker {
    void bind(WebSocketSession session);

    void invoke(String replyTo, String request);
}
