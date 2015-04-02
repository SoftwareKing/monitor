/**
 * Developer: Kadvin Date: 15/2/16 下午3:06
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.EngineServiceInvoker;
import dnt.monitor.engine.service.EngineServiceRegistry;
import dnt.monitor.exception.EngineException;
import dnt.monitor.engine.util.EngineServiceExporter;
import net.happyonroad.remoting.InvocationRequestMessage;
import net.happyonroad.remoting.InvocationResponseMessage;
import net.happyonroad.spring.Bean;
import org.springframework.remoting.support.RemoteInvocationResult;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

/**
 * The engine service invoker
 */
@Component
class DefaultEngineServiceInvoker extends Bean
        implements EngineServiceInvoker, EngineServiceRegistry {
    private WebSocketSession session;

    Map<Class, EngineServiceExporter> exporters = new HashMap<Class, EngineServiceExporter>();

    @Override
    public void bind(WebSocketSession session) {
        this.session = session;
    }

    @Override
    public <T> void register(Class<T> serviceClass, T service) {
        EngineServiceExporter exporter = new EngineServiceExporter();
        exporter.setServiceInterface(serviceClass);
        exporter.setService(service);
        exporter.createProxy();
        exporters.put(serviceClass, exporter);
    }

    @SuppressWarnings("ThrowableResultOfMethodCallIgnored")
    public void invoke(String replyTo, String request) {
        InvocationResponseMessage response = new InvocationResponseMessage();
        try {
            InvocationRequestMessage requestMessage = InvocationRequestMessage.parse(request);
            String serviceName = requestMessage.getServiceName();
            Class<?> serviceClass = Class.forName(serviceName);
            EngineServiceExporter exporter = exporters.get(serviceClass);
            if (exporter == null)
                throw new EngineException("The engine service " + serviceName + " is not ready");
            try {
                RemoteInvocationResult result = exporter.invokeIt(requestMessage.asInvocation());
                if (result.hasException()) {
                    Throwable cause;
                    if( result.getException() instanceof InvocationTargetException){
                        cause = result.getException().getCause();
                    }else{
                        cause = result.getException();
                    }
                    response.setError(cause);
                } else {
                    response.setValue(result.getValue());
                }
            } catch (Exception ex) {
                response.setError(ex);
            }

        }catch (Exception ex){
            response.setError(ex);
        }
        try {
            session.sendMessage(new TextMessage(replyTo + "@" + response.toJson()));
        } catch (IOException e) {
            logger.error("Failed to send message back to {}, {}, because of: {}", replyTo, response, e);
        }
    }
}
