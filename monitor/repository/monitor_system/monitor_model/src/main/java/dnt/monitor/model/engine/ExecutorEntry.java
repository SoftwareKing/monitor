package dnt.monitor.model.engine;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>Monitor Executor</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("dnt.monitor.engine:type=monitoring")
public class ExecutorEntry extends Entry {
    private static final long serialVersionUID = 3870247890472867591L;

    private String frequency, label, path, policyName, resourceAddress, resourceType, sampleServiceName, visitorName;
    private long startAt, latestExecutedAt, times;
    //超时次数, 失败次数
    private int overtimes, fails;

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public String getResourceAddress() {
        return resourceAddress;
    }

    public void setResourceAddress(String resourceAddress) {
        this.resourceAddress = resourceAddress;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getSampleServiceName() {
        return sampleServiceName;
    }

    public void setSampleServiceName(String sampleServiceName) {
        this.sampleServiceName = sampleServiceName;
    }

    public String getVisitorName() {
        return visitorName;
    }

    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName;
    }

    public long getStartAt() {
        return startAt;
    }

    public void setStartAt(long startAt) {
        this.startAt = startAt;
    }

    public long getLatestExecutedAt() {
        return latestExecutedAt;
    }

    public void setLatestExecutedAt(long latestExecutedAt) {
        this.latestExecutedAt = latestExecutedAt;
    }

    public int getOvertimes() {
        return overtimes;
    }

    public void setOvertimes(int overtimes) {
        this.overtimes = overtimes;
    }

    public int getFails() {
        return fails;
    }

    public void setFails(int fails) {
        this.fails = fails;
    }

    public long getTimes() {
        return times;
    }

    public void setTimes(long times) {
        this.times = times;
    }
}
