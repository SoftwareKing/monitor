/**
 * Developer: Kadvin Date: 15/1/20 上午10:14
 */
package dnt.monitor.server.service;

import dnt.monitor.server.model.ClientSession;

import java.security.Principal;
import java.util.Collection;

/**
 * <h1>Client Session Session</h1>
 */
public interface UserSessionService {
    Collection<ClientSession> getAllSessions();

    void register(String sessionId, ClientSession clientSession);

    void unregister(String sessionId);

    ClientSession getClientSession(String sessionId);

    @SuppressWarnings("UnusedDeclaration")
    void sendMessage(Principal principal, String message);

}
