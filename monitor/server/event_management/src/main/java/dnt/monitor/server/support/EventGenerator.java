package dnt.monitor.server.support;

import dnt.monitor.server.model.Event;
import dnt.monitor.server.service.EventService;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.AckStatus;
import net.happyonroad.type.Priority;
import net.happyonroad.type.Severity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

@Component
class EventGenerator extends Bean{
    @Autowired
    EventService service;
    private Timer timer;

    public void generate() {
        final List<String> paths = service.findDistinctPath();
        if( paths.isEmpty() ) {
            logger.debug("There is no event can be simulated");
            return;
        }
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                double random = Math.random();
                Priority[] priorities = Priority.values();
                Severity[] severities = Severity.values();
                AckStatus[] ackStatuses = AckStatus.values();

                Event event = new Event();
                event.setPath(paths.get((int) (random * paths.size())));
                event.setPriority(priorities[((int) (random * priorities.length))]);
                event.setSeverity(severities[((int) (random * severities.length))]);
                event.setAck(ackStatuses[((int) (random * ackStatuses.length))]);
                event.setContent("test error");
                event.creating();
                service.create(event);
            }
        }, 1000, 5000);
    }

    @Override
    protected void performStart() {
        generate();
    }

    @Override
    protected void performStop() {
        if( timer != null ) timer.cancel();
    }
}
