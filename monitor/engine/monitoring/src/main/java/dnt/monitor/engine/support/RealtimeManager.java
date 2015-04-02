/**
 * Developer: Kadvin Date: 15/2/16 下午2:31
 */
package dnt.monitor.engine.support;

import dnt.monitor.exception.EngineException;
import dnt.monitor.service.RealtimeService;
import net.happyonroad.spring.Bean;
import org.apache.commons.collections.Predicate;
import org.joda.time.Period;
import org.springframework.stereotype.Service;

/**
 * <h1>实时监控服务</h1>
 */
@Service
class RealtimeManager extends Bean implements RealtimeService {
    @Override
    public String startRealtime(String nodePath, Period period, Predicate filter) throws EngineException {
        return null;
    }

    @Override
    public boolean keepLiving(String realtimeId) throws EngineException {
        return false;
    }

    @Override
    public void stopRealtime(String realtimeId) throws EngineException {

    }
}
