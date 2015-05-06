/**
 * Developer: Kadvin Date: 15/2/16 上午11:06
 */
package dnt.monitor.server.util;

import dnt.monitor.server.model.EngineSession;
import net.happyonroad.annotation.Timeout;
import net.happyonroad.remoting.InvocationRequestMessage;
import net.happyonroad.remoting.InvocationResponseMessage;
import net.happyonroad.type.TimeInterval;
import org.apache.commons.proxy.Invoker;
import org.apache.commons.proxy.ProxyFactory;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.remoting.RemoteAccessException;

import java.lang.reflect.Method;
import java.util.UUID;

/**
 * <h1>Engine服务代理</h1>
 * 基于Engine Session上的消息通道，将对引擎的操作(发送消息/等待回应)封装成为服务
 * 配置在监控服务器上
 */
public class EngineServiceProxyFactoryBean
        implements FactoryBean, Invoker {
    static String DEFAULT_TIMEOUT = "60s"; //默认一次调用，60秒以内应该返回

    Class         serviceInterface;
    Object        serviceProxy;
    EngineSession session;

    public EngineServiceProxyFactoryBean(EngineSession session) {
        this.session = session;
    }

    /**
     * 设置代理的服务接口.
     *
     * @param serviceInterface 服务接口
     * @throws IllegalArgumentException 不支持null
     */
    public void setServiceInterface(Class serviceInterface) {
        if (serviceInterface == null || !serviceInterface.isInterface()) {
            throw new IllegalArgumentException("'serviceInterface' must be an interface");
        }
        this.serviceInterface = serviceInterface;
        //对这个proxy的调用，最终还是会调用到当前对象上
        this.serviceProxy = new ProxyFactory().createInvokerProxy(this, new Class[]{this.serviceInterface});
    }

    public void updateSession(EngineSession session) {
        this.session = session;
    }

    public Object getObject() {
        return this.serviceProxy;
    }

    public Class<?> getObjectType() {
        return this.serviceInterface;
    }

    public boolean isSingleton() {
        return true;
    }

    public Object invoke(Object proxy, Method method, Object[] arguments) throws Throwable {
        String methodName = method.getName();
        if (Object.class.equals(method.getDeclaringClass())) {
            return method.invoke(this, arguments);
        }
        //每次调用，都是在调用者的线程栈中，无需重新开辟线程

        String replyTo = UUID.randomUUID().toString();
        InvocationRequestMessage request = new InvocationRequestMessage();
        request.setServiceName(getObjectType().getName());
        request.setMethodName(methodName);
        request.populateArguments(method.getParameterTypes(), arguments);
        session.sendMessage(replyTo + "@" + request.toJson());
        // 获取超时时间
        Timeout timeoutConfig = AnnotationUtils.findAnnotation(method, Timeout.class);
        if( timeoutConfig == null ) {
            timeoutConfig = AnnotationUtils.findAnnotation(this.serviceInterface, Timeout.class);
        }
        String timeout;
        if( timeoutConfig == null ){
            timeout = DEFAULT_TIMEOUT;
        }else {
            timeout = timeoutConfig.value();
        }
        // 超时机制怎么控制? 可以每service设置一个，每方法设置，每次调用设置
        // 这句话可能会抛出 Offline Exception
        String reply = session.waitMessage(replyTo, (int)new TimeInterval(timeout).getMilliseconds());
        if (reply == null) throw new RemoteAccessException("Failed to get reply from " + replyTo);
        InvocationResponseMessage response = InvocationResponseMessage.parse(reply);
        // create invocation
        // send   invocation
        // wait   result
        // return result
        //noinspection ThrowableResultOfMethodCallIgnored
        if (response.getError() != null) throw response.recreateError();
        return response.getValue();
    }
}
