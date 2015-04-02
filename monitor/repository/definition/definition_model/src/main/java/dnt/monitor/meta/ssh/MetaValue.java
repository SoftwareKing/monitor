package dnt.monitor.meta.ssh;

import java.io.Serializable;

/**
 * <h1>SSH Meta Value</h1>
 * <p/>
 * Resolved from <code>@Value</code>
 *
 * @author Jay Xiong
 * @see dnt.monitor.annotation.ssh.Value
 */
public class MetaValue implements Serializable {
    private static final long serialVersionUID = -2570337784426745024L;

    private String value;
    private String converter;
    private String format;
    private double unitRate;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getConverter() {
        return converter;
    }

    public void setConverter(String converter) {
        this.converter = converter;
    }

    public double getUnitRate() {
        return unitRate;
    }

    public void setUnitRate(double unitRate) {
        this.unitRate = unitRate;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
