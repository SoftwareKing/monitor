/**
 * Developer: Kadvin Date: 15/1/21 下午2:37
 */
package dnt.monitor.server.model;

import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.model.MonitorEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

/**
 * <h1>代表引擎的会话对象</h1>
 * 有离线和在线两种实现
 */
public abstract class EngineSession {
    protected static PasswordEncoder encoder = new StandardPasswordEncoder();
    protected        Logger          logger  = LoggerFactory.getLogger(getClass());
    protected MonitorEngine engine;
    private   long          lastUpdatedAt;

    public EngineSession(MonitorEngine engine) {
        this.engine = engine;
    }

    public abstract void sendMessage(String task) throws IOException;

    public abstract String waitMessage(String replyId, int timeout)
            throws OfflineException, InterruptedException, ExecutionException, TimeoutException;

    public MonitorEngine getEngine() {
        return engine;
    }

    public long getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void updated() {
        this.lastUpdatedAt = System.currentTimeMillis();
    }

    public String getTaskChannelName(){
        return getEngine().getEngineId() + "/tasks";
    }
}
