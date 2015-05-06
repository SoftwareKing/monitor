/**
 * Developer: Kadvin Date: 15/1/29 下午3:26
 */
package dnt.monitor.server.handler.session;

import dnt.monitor.server.model.EngineOnlineSession;
import net.happyonroad.cache.CacheService;
import net.happyonroad.cache.ListContainer;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 引擎上线之后，将其所有离线任务发送过去
 */
@Component
class ResumeOfflineTasksAfterEngineOnline extends Bean implements ApplicationListener<ObjectCreatedEvent<EngineOnlineSession>> {
    Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    CacheService cacheService;

    public ResumeOfflineTasksAfterEngineOnline() {
        setOrder(Integer.MAX_VALUE);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<EngineOnlineSession> event) {
        EngineOnlineSession session = event.getSource();
        Object lock = null;
        try {
            ListContainer listContainer = cacheService.getListContainer(session.getTaskChannelName());
            lock = cacheService.startBatch();
            String offlinePayload;
            do {
                offlinePayload = listContainer.popRight();
                if( offlinePayload == null ) break;
                try {
                    session.sendMessage(offlinePayload);
                } catch (IOException e) {
                    logger.warn("Failed to send {} to {}", StringUtils.abbreviate(offlinePayload, 100), session);
                    //扔回去
                    listContainer.pushRight(offlinePayload);
                    break;
                    //TODO 发送失败怎么办？
                    // 当前方案为： 等待引擎再次断开/连上时重新尝试发过去呗！
                    // 虽然这是个懒人方案，但貌似是当前比较合适的方案（复杂度，可靠性之间的权衡)
                }
            }while (true);
        } catch (Exception e) {
            logger.error("Failed to work in batch mode", e);
        } finally {
            cacheService.releaseBatch(lock);
        }
    }
}
