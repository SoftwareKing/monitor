package dnt.monitor.engine.model;

import dnt.monitor.model.ResourceNode;
import dnt.monitor.policy.ResourcePolicy;
import net.happyonroad.type.TimeInterval;

import java.io.Serializable;

/**
 * <h1>资源监控任务</h1>
 * <p/>
 * 我们将面向某个资源的所有监控任务合并在这个对象中，包括：
 * 资源自身，资源下特定组件
 *
 * @author Jay Xiong
 */
public class MonitoringTask implements Serializable {
    private static final long serialVersionUID = -7576708219392051139L;

    private transient ResourceNode node;

    private transient ResourcePolicy policy;
    private           Long           policyId;
    //采集超时次数
    private transient int            overtimes;
    private           TimeInterval   frequency;
    private           int            fails;

    public MonitoringTask(ResourceNode node, ResourcePolicy policy) {
        updateNode(node);
        updatePolicy(policy);
    }

    public ResourceNode getNode() {
        return node;
    }

    public ResourcePolicy getPolicy() {
        return policy;
    }

    public String getPath() {
        return node.getPath();
    }

    public String getResourceType() {
        return node.getResource().getType();
    }

    public void updateNode(ResourceNode node) {
        if (node.getResource() == null && this.node != null )
            node.setResource(this.node.getResource());
       //TODO 暂时就以资源节点的监控频度进行监控，策略中定制的组件监控频度尚未实现
        if( node.getFrequency() != null )
            this.frequency = node.getFrequency();
        else //默认5分钟的监控频度
            this.frequency = new TimeInterval("5m");
        this.node = node;
    }

    public Long getPolicyId() {
        return policyId;
    }

    public void updatePolicy(ResourcePolicy policy) {
        this.policy = policy;
        this.policyId = policy.getId();
    }

    @Override
    public String toString() {
        return "MonitoringTask(" + node.getResource().getAddress() +
               ":" + getResourceType() + "@" + getPath() + ")";
    }

    /**
     * <h2>记录一次超时</h2>
     */
    public void overtime() {
        overtimes++;
    }

    /**
     * <h2>记录一次错误</h2>
     */
    public void fail() {
        fails++;
    }

    /**
     * <h2>判断是不是连续超时</h2>
     *
     * @return 超时的次数与原始设置的阈值相比，是否超过阈值，超过阈值，说明需要提升采集间隔
     */
    public boolean isOvertime() {
        int systemOvertime = Integer.valueOf(getNode().getProperty("monitoring.overtime", "3"));
        return overtimes >= systemOvertime;
    }

    public int getOvertimes() {
        return overtimes;
    }

    /**
     * <h1>记录一次准时</h1>
     */
    public void intime() {
        overtimes = 0;
    }

    public TimeInterval getFrequency() {
        return frequency;
    }

    public void doubleFrequency() {
        this.frequency = new TimeInterval(TimeInterval.parse(frequency.getMilliseconds() * 2));
    }

    public int getFails() {
        return fails;
    }
}
