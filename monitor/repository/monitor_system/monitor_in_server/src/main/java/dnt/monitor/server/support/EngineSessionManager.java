/**
 * Developer: Kadvin Date: 15/1/21 上午11:32
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.*;
import dnt.monitor.server.model.EngineAuthentication;
import dnt.monitor.server.model.EngineOfflineSession;
import dnt.monitor.server.model.EngineOnlineSession;
import dnt.monitor.server.model.EngineSession;
import dnt.monitor.server.service.EngineService;
import dnt.monitor.server.service.EngineSessionService;
import net.happyonroad.cache.CacheService;
import net.happyonroad.event.*;
import net.happyonroad.spring.ApplicationSupportBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * <h1>引擎会话管理器</h1>
 * <p/>
 * 连上来的引擎都已经被分配了engineId
 */
@Service
@ManagedResource(objectName = "dnt.monitor.server:type=service,name=engineSessionService")
public class EngineSessionManager extends ApplicationSupportBean implements EngineSessionService {
    @Autowired
    EngineService engineService;
    @Autowired
    CacheService  cacheService;
    Lock lock = new ReentrantLock();

    @Autowired
    @Qualifier("engineAuthenticationProvider")
    AuthenticationProvider authenticationProvider;
    Map<String, EngineOnlineSession> store = new ConcurrentHashMap<String, EngineOnlineSession>();

    @Override
    public void register(WebSocketSession session) throws EngineException {
        //现在使用的 Spring Security 3.2.5 还没有支持对WebSocket进行认证
        //  以后支持，认证之后的Engine权限分为：
        //  Anonymous/Engine/ApprovedEngine/DefaultEngine
        Authentication authentication = parseBasicAuthentication(session);
        Authentication authenticated = authenticationProvider.authenticate(authentication);
        String engineId = authentication.getName();
        MonitorEngine engine;
        if (authenticated instanceof EngineAuthentication) {
            engine = ((EngineAuthentication) authenticated).getEngine();
        } else {
            engine = engineService.findByEngineId(engineId);
        }
        EngineOnlineSession engineSession = getEngineOnlineSession(engineId);
        if (engineSession == null) {
            engineSession = new EngineOnlineSession(engine, session, authenticated);
            logger.info("Creating {}", engineSession);
            publishEvent(new ObjectCreatingEvent<EngineSession>(engineSession));
            lock.lock();
            try {
                store.put(engineId, engineSession);
            } finally {
                lock.unlock();
            }
            logger.info("Created  {}", engineSession);
            publishEvent(new ObjectCreatedEvent<EngineSession>(engineSession));
        } else {
            logger.info("Updating {}", engineSession);
            publishEvent(new ObjectUpdatingEvent<EngineSession>(engineSession, engineSession));
            engineSession.update(session);
            logger.info("Updated  {}", engineSession);
            publishEvent(new ObjectUpdatedEvent<EngineSession>(engineSession, engineSession));
        }

    }

    @Override
    public void unregister(WebSocketSession session) throws EngineException {
        EngineOnlineSession engineSession = getEngineSession(session);
        if (engineSession != null) {
            logger.warn("Deleting {}", engineSession);
            publishEvent(new ObjectDestroyingEvent<EngineOnlineSession>(engineSession));
            lock.lock();
            try {
                store.remove(engineSession.getEngineId());
            } finally {
                lock.unlock();
            }
            logger.warn("Deleted  {}", engineSession);
            publishEvent(new ObjectDestroyedEvent<EngineOnlineSession>(engineSession));
        } else {
            String engineId = parseEngineId(session);
            logger.warn("EngineSession(engineId={}, sessionId={}) lost", engineId, session.getId());
        }
    }

    @Override
    public EngineOnlineSession getEngineSession(WebSocketSession session) throws EngineException {
        String engineId = parseEngineId(session);
        return getEngineOnlineSession(engineId);
    }

    @Override
    public EngineOnlineSession getEngineOnlineSession(String engineId) {
        lock.lock();
        try {
            return store.get(engineId);
        } finally {
            lock.unlock();
        }
    }

    public EngineSession getEngineSession(MonitorEngine engine) {
        EngineSession session = getEngineOnlineSession(engine.getEngineId());
        if (session == null) {
            session = new EngineOfflineSession(engine, cacheService);
        }
        return session;
    }

    @ManagedAttribute
    public int getActiveSessionCount() {
        return store.size();
    }

    Authentication parseBasicAuthentication(WebSocketSession session) throws EngineException {
        String header = session.getHandshakeHeaders().getFirst("Authorization");
        if (!header.startsWith("Basic "))
            throw new EngineException("The engine's web socket request basic authentication!");
        String[] tokens;
        try {
            tokens = extractAndDecodeHeader(header);
        } catch (UnsupportedEncodingException e) {
            throw new EngineException("Bad authentication encoding", e);
        }
        assert tokens.length == 2;
        return new UsernamePasswordAuthenticationToken(tokens[0], tokens[1]);
    }

    String parseEngineId(WebSocketSession session) throws EngineException {
        return parseBasicAuthentication(session).getName();
    }

    /**
     * Decodes the header into a username and password.
     *
     * @throws org.springframework.security.authentication.BadCredentialsException if the Basic header is not present or is not valid Base64
     */
    String[] extractAndDecodeHeader(String header) throws UnsupportedEncodingException {

        byte[] base64Token = header.substring(6).getBytes("UTF-8");
        byte[] decoded;
        try {
            decoded = Base64.decode(base64Token);
        } catch (IllegalArgumentException e) {
            throw new BadCredentialsException("Failed to decode basic authentication token");
        }

        String token = new String(decoded);

        int delim = token.indexOf(":");

        if (delim == -1) {
            throw new BadCredentialsException("Invalid basic authentication token");
        }
        return new String[]{token.substring(0, delim), token.substring(delim + 1)};
    }

}
