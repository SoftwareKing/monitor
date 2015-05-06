/**
 * Developer: Kadvin Date: 15/1/1 下午7:16
 */
package dnt.monitor.server.support;

import net.happyonroad.event.ObjectEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.ParseUtils;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * The resource event printer
 */
@Component
class ObjectEventPrinter extends Bean implements ApplicationListener<ObjectEvent>{
    @Override
    public void onApplicationEvent(ObjectEvent event) {
        if (!logger.isInfoEnabled()) return;
        logger.info("{} {}", event.getClass().getSimpleName(), ParseUtils.toJSONString(event));
    }
}
