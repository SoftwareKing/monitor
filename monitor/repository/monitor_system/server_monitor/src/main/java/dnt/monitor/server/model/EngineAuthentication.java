/**
 * Developer: Kadvin Date: 15/1/29 下午2:33
 */
package dnt.monitor.server.model;

import dnt.monitor.model.MonitorEngine;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * The engine authentication
 */
public class EngineAuthentication extends AbstractAuthenticationToken {
    private MonitorEngine engine;

    public EngineAuthentication(MonitorEngine engine, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.engine = engine;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return engine.getApiToken();
    }

    @Override
    public Object getPrincipal() {
        return engine.getEngineId();
    }

    public MonitorEngine getEngine() {
        return engine;
    }
}
