/**
 * Developer: Kadvin Date: 15/1/21 上午9:18
 */
package dnt.monitor.server.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.server.model.EngineOnlineSession;
import dnt.monitor.server.model.EngineSession;
import dnt.monitor.model.MonitorEngine;
import org.springframework.web.socket.WebSocketSession;

/**
 * <h1>引擎的会话</h1>
 */
public interface EngineSessionService {
    void register(WebSocketSession session) throws EngineException;

    void unregister(WebSocketSession session) throws EngineException;

    /**
     * <h2>根据 WebSocket Session 获取对应的引擎会话</h2>
     *
     * @param session web socket session
     * @return 在线引擎会话
     */
    EngineOnlineSession getEngineSession(WebSocketSession session) throws EngineException;

    /**
     * <h2>根据引擎id获取对应的会话</h2>
     *
     * @param engineId 引擎的id
     * @return 在线会话
     */
    EngineOnlineSession getEngineOnlineSession(String engineId);

    /**
     * <h2>获取引擎的会话，无论其是否在线，都会返回一个会话对象</h2>
     *
     * @param engine 会话对应的引擎
     * @return 在线或者离线的会话
     */
    EngineSession getEngineSession(MonitorEngine engine);
}
