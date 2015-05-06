/**
 * Developer: Kadvin Date: 15/2/5 下午7:34
 */
package dnt.monitor.meta;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import net.happyonroad.util.StringUtils;
import org.springframework.jmx.export.annotation.ManagedAttribute;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * <h1>元模型相关对象</h1>
 *
 * 分为 元模型(MetaModel)和元属性(MetaField)两大类
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public abstract class MetaObject implements Cloneable {
    protected String label;
    protected String description;

    /// Properties support ///
    // 字符串扩展属性
    private Properties properties;
    // 对象扩展属性
    protected Map<Class, Object> attributes;

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    public String getProperty(String name, String defaultValue) {
        if (this.properties == null) return defaultValue;
        return this.properties.getProperty(name, defaultValue);
    }

    public void setProperty(String name, String value) {
        if (this.properties == null) this.properties = new Properties();
        this.properties.setProperty(name, value);
    }

    public String getProperty(String name){
        return getProperty(name, null);
    }

    public Map<Class, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<Class, Object> attributes) {
        this.attributes = attributes;
    }

    public <T> T getAttribute(Class<T> klass){
        if( attributes == null )  return null;
        //noinspection unchecked
        return (T) attributes.get(klass);
    }

    public <T> void setAttribute(Class<T> klass, T value){
        if( attributes == null ) attributes = new HashMap<Class, Object>();
        attributes.put(klass, value);
    }

    @ManagedAttribute
    public abstract String getName();

    @ManagedAttribute
    public String getLabel() {
        return label;
    }

    @ManagedAttribute
    public void setLabel(String label) {
        this.label = label;
    }

    @ManagedAttribute
    public String getDescription() {
        return description;
    }

    @ManagedAttribute
    public void setDescription(String description) {
        this.description = description;
    }

    protected String readable(String name){
        return StringUtils.camelCase(name.replaceAll("\\.", " "));
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + (getLabel() == null ? getName() : getLabel())+ ")";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MetaObject)) return false;

        MetaObject that = (MetaObject) o;

        if (attributes != null ? !attributes.equals(that.attributes) : that.attributes != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (label != null ? !label.equals(that.label) : that.label != null) return false;
        if (properties != null ? !properties.equals(that.properties) : that.properties != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = label != null ? label.hashCode() : 0;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (properties != null ? properties.hashCode() : 0);
        result = 31 * result + (attributes != null ? attributes.hashCode() : 0);
        return result;
    }
}
