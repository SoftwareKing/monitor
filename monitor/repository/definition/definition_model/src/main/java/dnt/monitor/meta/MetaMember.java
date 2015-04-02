/**
 * Developer: Kadvin Date: 15/2/4 上午9:38
 */
package dnt.monitor.meta;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dnt.monitor.meta.misc.MetaDepends;
import dnt.monitor.meta.misc.MetaKeyed;
import dnt.monitor.model.ManagedObject;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Map;

/**
 * <h1>Indicator/Config/Metric/Relation等成员的描述</h1>
 * <p/>
 * 这些描述了某个指标容器内的信息
 */
public class MetaMember extends MetaObject {
    //这个Field声明时所在的类（当出现继承时，其可能和当前的宿主模型对应的class不一致/是其父类)
    Class<? extends ManagedObject> declaringClass;
    //这个成员对应的对象成员，可能是方法，可能是字段
    PropertyDescriptor             property;
    String                         dataType;    //single/array/map
    MetaKeyed                      keyed;
    MetaDepends                    depends;

    public MetaMember(Class<? extends ManagedObject> declaringClass, PropertyDescriptor property) {
        setDeclaringClass(declaringClass);
        setProperty(property);
        Class<?> propertyType = property.getPropertyType();
        if (Array.class.isAssignableFrom(propertyType) || propertyType.isArray()) {
            dataType = "array";
        } else if (Collection.class.isAssignableFrom(propertyType)) {
            if (Map.class.isAssignableFrom(propertyType)) {
                dataType = "map";
            } else {
                dataType = "array";
            }
        } else {
            dataType = "single";
        }
    }

    protected void setDeclaringClass(Class<? extends ManagedObject> declaringClass) {
        this.declaringClass = declaringClass;
    }

    @JsonIgnore
    public Class<? extends ManagedObject> getDeclaringClass() {
        return declaringClass;
    }

    void setProperty(PropertyDescriptor property) {
        this.property = property;
    }

    @JsonIgnore
    public PropertyDescriptor getProperty() {
        return property;
    }

    public MetaMember clone(Class<? extends ManagedObject> declaringClass, PropertyDescriptor property)
            throws CloneNotSupportedException {
        MetaMember cloned = (MetaMember) clone();
        cloned.setDeclaringClass(declaringClass);
        cloned.setProperty(property);
        //不需要检查cloned和本类的类型兼容性，由java编译器保障
        return cloned;
    }

    public MetaKeyed getKeyed() {
        return keyed;
    }

    public void setKeyed(MetaKeyed keyed) {
        this.keyed = keyed;
    }

    public String getName() {
        return property.getName();
    }

    public String getDataType() {
        return dataType;
    }

    public MetaDepends getDepends() {
        return depends;
    }

    public void setDepends(MetaDepends depends) {
        this.depends = depends;
    }
}
