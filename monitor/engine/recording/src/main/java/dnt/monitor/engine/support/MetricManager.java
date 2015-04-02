/**
 * Developer: Kadvin Date: 15/2/16 下午4:09
 */
package dnt.monitor.engine.support;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.MetricValues;
import dnt.monitor.service.MetricService;
import net.happyonroad.spring.Bean;
import org.springframework.stereotype.Service;

/**
 * <h1>Metric Service</h1>
 */
@Service
class MetricManager extends Bean implements MetricService {
    @Override
    public MetricValues fetch(String path, String funcName, long fetchStart, long fetchEnd, long resolution)
            throws EngineException {
        return null;
    }
}
