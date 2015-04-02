/**
 * Developer: Kadvin Date: 15/1/15 下午8:47
 */
package dnt.monitor.server.handler;

import dnt.monitor.exception.EngineException;
import dnt.monitor.server.model.EngineOnlineSession;
import dnt.monitor.server.service.EngineSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * <h1>处理来自下端监控引擎的请求</h1>
 */
@Component
class SouthHandler extends TextWebSocketHandler {
    private static final int KB = 1024;
    Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    EngineSessionService sessionService;

    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        logger.info("A south web socket connection established:  {}/{}", session.getRemoteAddress(), session.getId());

        try {
            session.setTextMessageSizeLimit(2 * KB * KB);
            sessionService.register(session);
        } catch (EngineException e) {
            logger.error("Failed to register engine session {}", e);
            throw e;
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        logger.info("A south web socket connection disconnected: {}/{}", session.getRemoteAddress(), session.getId());
        try {
            sessionService.unregister(session);
        } catch (EngineException e) {
            logger.error("Failed to unregister engine session {}", e );
            throw e;
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
        logger.debug("Got message: {}", message);
        try {
            EngineOnlineSession engineSession = sessionService.getEngineSession(session);
            engineSession.handle(message.getPayload());
        } catch (Exception e) {
            logger.error("Error while handle {}, because of {}", message, e.getMessage());
        }
    }
}
