/**
 * Developer: Kadvin Date: 15/1/20 下午2:44
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.EngineServiceInvoker;
import dnt.monitor.engine.event.EngineConnectedEvent;
import dnt.monitor.engine.event.EngineDisconnectedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

/**
 * <h1> the engine web socket handler</h1>
 */
class EngineWebSocketHandler extends AbstractWebSocketHandler {
    private static final int KB = 1024;
    private Logger logger = LoggerFactory.getLogger(getClass());
    private final ApplicationEventPublisher publisher;
    private final EngineServiceInvoker      invoker;

    public EngineWebSocketHandler(EngineServiceInvoker invoker, ApplicationEventPublisher publisher) {
        this.invoker = invoker;
        this.publisher = publisher;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        invoker.bind(session);
        publisher.publishEvent(new EngineConnectedEvent(session));
        session.setTextMessageSizeLimit(2 * KB * KB);
        logger.info("Session established {}", session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
        logger.debug("Got text message: {}", message);
        String replyTo = message.getPayload().substring(0, 36);
        String request = message.getPayload().substring(37);
        invoker.invoke(replyTo, request);
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        super.handleBinaryMessage(session, message);
        logger.debug("Got binary message: {}", message);
        throw new UnsupportedOperationException("Not configured to implements by binary message now");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        publisher.publishEvent(new EngineDisconnectedEvent(session));
        logger.info("Session closed {}", session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        super.handleTransportError(session, exception);
        logger.warn("Transport error: {}", exception.getMessage());
    }
}
