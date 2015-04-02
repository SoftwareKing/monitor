/**
 * Developer: Kadvin Date: 15/3/12 上午11:24
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.event.EngineApprovedEvent;
import dnt.monitor.engine.event.EngineRejectedEvent;
import dnt.monitor.exception.EngineException;
import dnt.monitor.service.ControlService;
import net.happyonroad.spring.ApplicationSupportBean;
import org.springframework.stereotype.Service;

/**
 * <h1>实现Server对Engine的控制服务</h1>
 *
 * 主要实现原理是，在本类中并不执行什么具体的业务操作，而是发出相应的控制事件，由关注者收到事件后执行相应的操作
 */
@Service
class ControlManager extends ApplicationSupportBean implements ControlService {
    @Override
    public void approve() throws EngineException {
        logger.info("I'm approved");
        publishEvent(new EngineApprovedEvent(this));
    }

    @Override
    public void reject() throws EngineException {
        logger.info("I'm rejected");
        publishEvent(new EngineRejectedEvent(this));
    }
}
