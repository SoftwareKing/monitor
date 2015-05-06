/**
 * Developer: Kadvin Date: 15/1/20 上午10:26
 */
package dnt.monitor.server.support;

import dnt.monitor.server.model.ClientSession;
import dnt.monitor.server.service.UserSessionService;
import net.happyonroad.event.*;
import net.happyonroad.spring.ApplicationSupportBean;
import org.apache.commons.lang.Validate;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * <h1>会话管理</h1>
 */
@Service
@ManagedResource(objectName = "dnt.monitor.server:type=service,name=userSessionService")
public class UserSessionManager extends ApplicationSupportBean implements UserSessionService {
    Map<String, ClientSession> sessions = new HashMap<String, ClientSession>();

    @Override
    public Collection<ClientSession> getAllSessions() {
        return sessions.values();
    }

    @Override
    public void register(String sessionId, ClientSession clientSession) {
        publishEvent(new ObjectCreatingEvent<ClientSession>( clientSession ));
        ClientSession exist = sessions.get(sessionId);
        try {
            Validate.isTrue(exist == null, "The session with id = " + sessionId + " is registered already");
        } catch (IllegalArgumentException e) {
            publishEvent(new ObjectCreateFailureEvent<ClientSession>(clientSession, e));
            throw e;
        }
        sessions.put(sessionId, clientSession);
        publishEvent(new ObjectCreatedEvent<ClientSession>( clientSession ));
    }

    @Override
    public void unregister(String sessionId) {
        ClientSession exist = sessions.get(sessionId);
        if( exist == null ){
            logger.warn("The session with id = " + sessionId + " is unregistered already");
        }else{
            publishEvent(new ObjectDestroyingEvent<ClientSession>(exist));
            sessions.remove(sessionId);
            publishEvent(new ObjectDestroyedEvent<ClientSession>(exist));
        }
    }

    @Override
    public ClientSession getClientSession(String sessionId) {
        ClientSession session = sessions.get(sessionId);
        Validate.notNull(session, "The session with id = " + sessionId + " is not exist");
        return session;
    }

    @Override
    public void sendMessage(Principal principal, String message) {
        if( null == principal ) {
            for (ClientSession session : sessions.values()) {
                sendMessage(session, message);
            }
            return ;
        }

        for(ClientSession session : sessions.values()){
            if( session.getUserPrinciplal().equals(principal )){
                sendMessage(session, message);
            }
        }
    }

    @ManagedAttribute
    public int getActiveSessionCount(){
        return sessions.size();
    }

    private void sendMessage(ClientSession session, String message) {
        try {
            session.sendMessage(message);
        } catch (IOException e) {
            logger.warn("Can't send message to " +  session.getUserPrinciplal() + "'s session " + session.getId() + " : " + e.getMessage());
        }
    }
}
