/**
 * Developer: Kadvin Date: 15/1/21 下午2:36
 */
package dnt.monitor.server.model;

import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.model.MonitorEngine;
import net.happyonroad.cache.CacheService;
import net.happyonroad.cache.ListContainer;
import net.happyonroad.util.StringUtils;

import java.io.IOException;

/**
 * <h1>代表离线引擎的会话</h1>
 * 发向离线会话的任务会被存储到redis中，待其会话在线之后再派发给监控引擎
 */
public class EngineOfflineSession extends EngineSession{

    private final CacheService cacheService;

    public EngineOfflineSession(MonitorEngine engine, CacheService cacheService) {
        super(engine);
        this.cacheService = cacheService;
    }

    @Override
    public void sendMessage(String task) throws IOException {
        //store the engine task to redis
        logger.debug("Storing {} for {}", StringUtils.abbreviate(task, 70), engine);
        ListContainer listContainer = cacheService.getListContainer(getTaskChannelName());
        listContainer.pushLeft(task.getBytes());
        logger.debug("Stored  {} for {}", StringUtils.abbreviate(task, 70), engine);
    }

    @Override
    public String waitMessage(String replyId, int timeout) throws OfflineException {
        throw new OfflineException("The offline session do not support synchronized method!");
    }
}
