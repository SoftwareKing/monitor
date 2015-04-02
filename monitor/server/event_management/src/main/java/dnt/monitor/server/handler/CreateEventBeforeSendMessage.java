package dnt.monitor.server.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dnt.monitor.server.model.Event;
import dnt.monitor.server.service.UserSessionService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CreateEventBeforeSendMessage extends Bean implements ApplicationListener<ObjectCreatedEvent<Event>> {
    @Autowired
    UserSessionService sessionService;

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<Event> evt) {
        Event event = evt.getSource();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("type", "updateEvent");
        map.put("data", event);

        ObjectMapper mapper = new ObjectMapper();
        String message;
        try {
            message = mapper.writeValueAsString(map);
//            sessionService.sendMessage(null, message);
        } catch (JsonProcessingException e) {
            logger.warn("Error to convert message to json which message = " + map, e);
        }
    }
}
