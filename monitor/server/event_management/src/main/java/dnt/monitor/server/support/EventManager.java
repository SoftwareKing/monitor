package dnt.monitor.server.support;

import dnt.monitor.server.model.Event;
import dnt.monitor.server.repository.EventRepository;
import dnt.monitor.server.service.EventService;
import net.happyonroad.event.ObjectCreateFailureEvent;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.event.ObjectCreatingEvent;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;
import net.happyonroad.platform.util.DefaultPage;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.type.Severity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Service;
import org.w3c.dom.events.EventException;

import java.util.*;

/**
 * 事件相关业务方法的实现
 */

@Service
@ManagedResource(objectName = "dnt.monitor.server:type=service,name=eventService")
public class EventManager extends ApplicationSupportBean implements EventService {
    @Autowired
    private EventRepository repository;

    public Map<Severity, Integer> summary(String path)
    {
        Map<Severity, Integer> summary = new HashMap<Severity, Integer>();
        List<Map<String, Object>> list = repository.summary(path);
        for(Map<String, Object> map : list)
        {
            summary.put((Severity)map.get("severity"), (Integer)map.get("count"));
        }
        return summary;
    }

    public Page<Event> paginateByPath(String path, Pageable pageable)
    {
        long count = repository.countByPath(path);
        if( count > 0 )
        {
            List<Event> events = repository.findPaginationByPath(path, pageable);
            return new DefaultPage<Event>(events, pageable , count);
        }
        else
        {
            return new DefaultPage<Event>(new ArrayList<Event>(), pageable, 0);
        }
    }

    @Override
    public Event create(Event event) throws EventException {
        logger.info("Creating {}", event);
        try {
            publishEvent(new ObjectCreatingEvent<Event>(event));
            repository.create(event);
            publishEvent(new ObjectCreatedEvent<Event>(event));
            logger.info("Created {}", event);
        } catch (Exception e) {
            logger.warn("Failed to create " + event, e);
            publishEvent(new ObjectCreateFailureEvent<Event>(event, e));
            throw new EventException((short)0, "Can't create event " + e);
        }
        return event;
    }

    @Override
    public List<String> findDistinctPath() {
        logger.debug("Finding distinct event paths");
        List<String> paths = repository.findDistinctPath();
        logger.debug("Found   distinct event paths: {}", paths.size());
        return paths;
    }

    @ManagedAttribute
    public Properties getEventSize(){
        Map<Severity, Integer> summary = summary("/");
        Properties properties = new Properties();
        for (Map.Entry<Severity, Integer> entry : summary.entrySet()) {
             properties.setProperty(entry.getKey().toString(), entry.getValue().toString());
        }
        return properties;
    }
}
