/**
 * Developer: Kadvin Date: 15/2/16 上午10:14
 */
package dnt.monitor.model;

import java.io.Serializable;

/**
 * <h1>指标值</h1>
 * 从RRD的FetchData中转过来
 */
public class MetricValues implements Serializable{
    private static final long serialVersionUID = -2742939058602193390L;
    private long[] timestamps;
    private double[][] values;
    private long       arcStep;
    private long       arcEndTime;

    public MetricValues() {
    }

    public MetricValues(long arcStep, long arcEndTime, long[] timestamps, double[][] values) {
        this.timestamps = timestamps;
        this.values = values;
        this.arcStep = arcStep;
        this.arcEndTime = arcEndTime;
    }

    public long[] getTimestamps() {
        return timestamps;
    }

    public double[][] getValues() {
        return values;
    }

    public long getArcStep() {
        return arcStep;
    }

    public long getArcEndTime() {
        return arcEndTime;
    }
}
