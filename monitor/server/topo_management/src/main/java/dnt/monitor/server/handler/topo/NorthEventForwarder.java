package dnt.monitor.server.handler.topo;

import dnt.monitor.server.model.ClientSession;
import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.service.UserSessionService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.event.ObjectDestroyedEvent;
import net.happyonroad.event.ObjectEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.ParseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

/**
 * <h1>转发事件给前端</h1>
 * TODO： 应该将事件转发任务放到其他线程去，以免阻塞后台业务操作
 *
 * @author Jay Xiong
 */
@Component
public class NorthEventForwarder extends Bean implements ApplicationListener<ObjectEvent>, Runnable {
    @Autowired
    UserSessionService sessionService;

    BlockingQueue<ObjectEvent> events = new LinkedBlockingDeque<ObjectEvent>();

    @Override
    public void onApplicationEvent(ObjectEvent event) {
        if (!acceptEventType(event)) return;
        if (!acceptEventSource(event.getSource())) return;
        //TODO 临时解决方案：
        // 现在客户端收到消息过快，会导致消息发送失败，
        // 回头更新数据库也会过快，需要降低消息速度
        // 采用临时的存储发送的方案
        events.add(event);
    }

    @Override
    protected void performStart() {
        super.performStart();
        Executors.newFixedThreadPool(2).execute(this);
    }

    private boolean acceptEventType(ObjectEvent event) {
        return event instanceof ObjectCreatedEvent ||
               event instanceof ObjectUpdatedEvent ||
               event instanceof ObjectDestroyedEvent;
    }

    private boolean acceptEventSource(Object source) {
        return source instanceof TopoMap ||
               source instanceof TopoNode ||
               source instanceof TopoLink;
    }

    @Override
    public void run() {
        while( isRunning() ){
            ObjectEvent event ;
            try {
                event = events.poll(1, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                continue;
            }
            if( event == null ) continue;
            for (ClientSession session : sessionService.getAllSessions()) {
                try {
                    session.sendMessage(ParseUtils.toJSONString(event));
                } catch (IOException e) {
                    logger.debug("Can't send {} to {}", event, session);
                }
            }
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                //skip
            }
        }
    }
}
