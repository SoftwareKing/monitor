package dnt.monitor.policy;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;

/**
 * <h1>Class Title</h1>
 *
 * @author Jay Xiong
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class ConfigPolicy implements Serializable{
    private static final long serialVersionUID = 1190606935427249856L;

    private String  fieldName;
    private boolean keyed;
    private String unit;//这个一般不予以重新定义

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public boolean isKeyed() {
        return keyed;
    }

    public void setKeyed(boolean keyed) {
        this.keyed = keyed;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
