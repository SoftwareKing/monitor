/**
 * Developer: Kadvin Date: 15/2/16 下午2:29
 */
package dnt.monitor.engine.support;

import dnt.monitor.exception.EngineException;
import dnt.monitor.model.Component;
import dnt.monitor.model.Resource;
import dnt.monitor.service.SynchronizeService;
import net.happyonroad.spring.Bean;
import org.apache.commons.collections.Predicate;
import org.springframework.stereotype.Service;

/**
 * <h1>同步服务</h1>
 */
@Service
class SynchronizeManager extends Bean implements SynchronizeService {
    @Override
    public Resource syncNode(String nodePath) throws EngineException {
        return null;
    }

    @Override
    public Component syncComponent(String nodePath, Component component) throws EngineException {
        return null;
    }

    @Override
    public Resource syncComponents(String nodePath, Predicate predicate) throws EngineException {
        return null;
    }
}
