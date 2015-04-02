/**
 * Developer: Kadvin Date: 15/1/15 下午8:47
 */
package dnt.monitor.server.handler;

import dnt.monitor.server.model.ClientSession;
import dnt.monitor.server.service.UserSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * <h1>处理来自前端的请求</h1>
 */
@Component
class NorthHandler extends TextWebSocketHandler {
    Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    UserSessionService sessionService;

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        logger.info("A north web socket connection established:  {}/{}", session.getRemoteAddress(), session.getId());
        sessionService.register(session.getId(), new ClientSession(session));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        logger.info("A north web socket connection disconnected: {}/{}", session.getRemoteAddress(), session.getId());
        sessionService.unregister(session.getId());
    }

    @Override
    protected void handleTextMessage(final WebSocketSession session, final TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
        logger.debug("Got message: {}", message.getPayload());
        ClientSession clientSession =  sessionService.getClientSession(session.getId());
        clientSession.handleTextMessage(message.getPayload());
    }

}
