package dnt.monitor.model.server;

import dnt.monitor.annotation.jmx.ObjectAttr;
import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>各种服务的统计</h1>
 *
 * @author Jay Xiong
 */
public class ServiceStats extends Entry{
    private static final long serialVersionUID = 5266910497306372086L;
    @ObjectName("dnt.monitor.server:type=service,name=engineSessionService")
    @ObjectAttr("ActiveSessionCount")
    private int activeEngineSessionCount;

    @ObjectName("dnt.monitor.server:type=service,name=userSessionService")
    @ObjectAttr("ActiveSessionCount")
    private int activeUserSessionCount;

    @ObjectName("dnt.monitor.server:type=service,name=policyService")
    @ObjectAttr("PolicySize")
    private int policySize;

    @ObjectName("dnt.monitor.server:type=service,name=topoService")
    @ObjectAttr("MapCount")
    private int topoMapCount;

    public int getActiveEngineSessionCount() {
        return activeEngineSessionCount;
    }

    public void setActiveEngineSessionCount(int activeEngineSessionCount) {
        this.activeEngineSessionCount = activeEngineSessionCount;
    }

    public int getActiveUserSessionCount() {
        return activeUserSessionCount;
    }

    public void setActiveUserSessionCount(int activeUserSessionCount) {
        this.activeUserSessionCount = activeUserSessionCount;
    }

    public int getPolicySize() {
        return policySize;
    }

    public void setPolicySize(int policySize) {
        this.policySize = policySize;
    }

    public int getTopoMapCount() {
        return topoMapCount;
    }

    public void setTopoMapCount(int topoMapCount) {
        this.topoMapCount = topoMapCount;
    }
}
