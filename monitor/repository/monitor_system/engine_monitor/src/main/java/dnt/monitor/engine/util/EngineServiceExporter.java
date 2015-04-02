/**
 * Developer: Kadvin Date: 15/2/16 下午1:53
 */
package dnt.monitor.engine.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.remoting.support.RemoteInvocation;
import org.springframework.remoting.support.RemoteInvocationBasedExporter;
import org.springframework.remoting.support.RemoteInvocationResult;

/**
 * <h1>Engine服务发布器</h1>
 */
public class EngineServiceExporter extends RemoteInvocationBasedExporter{
    private static Logger logger = LoggerFactory.getLogger(EngineServiceExporter.class);

    private Object  proxy;

    public void createProxy() {
        this.proxy = getProxyForService();
        logger.info("Export " + getServiceInterface().getName());
    }

    public RemoteInvocationResult invokeIt(RemoteInvocation remoteInvocation) {
        return invokeAndCreateResult(remoteInvocation, proxy);
    }

}
