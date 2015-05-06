package dnt.monitor.engine.support;

import dnt.monitor.engine.service.DiscoveryContext;
import dnt.monitor.exception.EngineException;
import net.happyonroad.spring.Bean;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * <h1>并发发现时，对同一个设备的控制</h1>
 *
 * @author Jay Xiong
 */
@Component
public class DefaultDiscoveryContext extends Bean implements DiscoveryContext {
    final   Lock                lock          = new ReentrantLock();
    private Map<String, String> nameToThreads = new HashMap<String, String>();

    @Override
    public void acquire(String name, Set<String> ips) throws EngineException {
        lock.tryLock();
        try {
            String key = name + "@" + ips.hashCode();
            String threadName = nameToThreads.get(key);
            if( threadName == null ){
                nameToThreads.put(key, Thread.currentThread().getName());
            }else{
                throw new EngineException("The " + threadName + " has acquired lock of " + key);
            }
        } finally {
            lock.unlock();
        }
    }
}
