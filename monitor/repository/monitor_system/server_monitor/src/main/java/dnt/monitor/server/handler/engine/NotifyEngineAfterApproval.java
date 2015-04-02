/**
 * Developer: Kadvin Date: 15/1/26 上午11:03
 */
package dnt.monitor.server.handler.engine;

import dnt.monitor.exception.EngineException;
import dnt.monitor.server.exception.OfflineException;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.service.ControlService;
import dnt.monitor.server.service.EngineServiceLocator;
import net.happyonroad.event.ObjectSavedEvent;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>监控引擎被管理员审批后，通知相应的实际引擎</h1>
 *
 * 管理员审批批准/拒绝，都应该通过该接口通知实际监控引擎
 *
 * 实际监控引擎在收到被批准的消息之后，应该首先将自己的ApiToken保存下来，
 * 而后按照正常的方式继续工作（具体有哪些，有待开发）
 * 而被拒绝后，应该标记自己被拒绝，而后退出（以后再次重启也会发现自己被拒绝）
 * 现在标记被拒绝的方式为设置一个错误的api token，校验时失败而退出
 */
@Component
class NotifyEngineAfterApproval extends Bean implements ApplicationListener<ObjectSavedEvent<MonitorEngine>> {
    @Autowired
    EngineServiceLocator engineServiceLocator;

    @Override
    public void onApplicationEvent(ObjectSavedEvent<MonitorEngine> event) {
        //可能是新建时直接批准/或者拒绝
        // 也可能是手工批准拒绝(更新后)
        if( event instanceof ObjectUpdatedEvent){
            ObjectUpdatedEvent<MonitorEngine> updatedEvent = (ObjectUpdatedEvent<MonitorEngine>) event;
            if (isApproving(updatedEvent.getLegacySource(), updatedEvent.getSource())) {
                notifyApproved(updatedEvent.getSource());
            } else if (isRejecting(updatedEvent.getLegacySource(), updatedEvent.getSource())) {
                notifyRejected(updatedEvent.getSource());
            }
        }else {
            if( event.getSource().isApproved() ){
                notifyApproved(event.getSource());
            }else if ( event.getSource().isRejected() ) {
                notifyRejected(event.getSource());
            }
        }
    }

    private void notifyApproved(MonitorEngine engine) {
        // get Engine NBI for control service
        ControlService controlService = engineServiceLocator.locate(engine, ControlService.class);
        try {
            controlService.approve();
        } catch (OfflineException e) {
            logger.debug("{} has been approved, but it's offline now", engine);
        } catch (EngineException e) {
            logger.warn("Can't approve {}", engine);
        }
    }

    private void notifyRejected(MonitorEngine engine) {
        // get Engine NBI for control service
        ControlService controlService = engineServiceLocator.locate(engine, ControlService.class);
        try {
            controlService.reject();
        } catch (OfflineException e) {
            logger.debug("{} has been rejected, but it's offline now", engine);
        } catch (EngineException e) {
            logger.warn("Can't reject {}", engine);
        }
    }

    boolean isApproving(MonitorEngine oldEngine, MonitorEngine newEngine) {
        return (oldEngine.isRequesting()) && (newEngine.isApproved());

    }
    boolean isRejecting(MonitorEngine oldEngine, MonitorEngine newEngine) {
        return (oldEngine.isRequesting())
                && (newEngine.isRejected());

    }

}
