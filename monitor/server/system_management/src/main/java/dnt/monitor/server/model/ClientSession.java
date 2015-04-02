/**
 * Developer: Kadvin Date: 15/1/20 上午10:23
 */
package dnt.monitor.server.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.security.Principal;

/**
 * <h1>代表一个客户的会话</h1>
 */
public class ClientSession {
    private final WebSocketSession session;
    private static Logger logger = LoggerFactory.getLogger(ClientSession.class);

    public ClientSession(WebSocketSession session) {
        this.session = session;
    }

    public void handleTextMessage(String messagePayload) {
        //淹没
        logger.info("Got {}", messagePayload);
    }

    public Principal getUserPrinciplal() {
        return this.session.getPrincipal();
    }

    public void sendMessage(String message) throws IOException {
        this.session.sendMessage(new TextMessage(message));
    }

    public String getId() {
        return session.getId();
    }
}
