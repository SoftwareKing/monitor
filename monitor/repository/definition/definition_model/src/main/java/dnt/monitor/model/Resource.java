/**
 * Developer: Kadvin Date: 14/12/23 下午3:25
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Config;
import dnt.monitor.util.MoIdResolver;
import net.happyonroad.util.StringUtils;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * 所有的资源对象的父类：采用单表继承
 */
@Category("/")
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
@JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY)
public class Resource extends ManagedObject {
    public static final String PROPERTY_RELATIVE_PATH = "relativePath";
    public static final String PROPERTY_SCOPE_PATH    = "scopePath";
    public static final String PROPERTY_SYSTEM_PATH   = "systemPath";
    public static final String PROPERTY_SOURCE        = "source";
    public static final String PROPERTY_UP_LINK       = "upLink";

    private static final long serialVersionUID = 6879227819554909475L;
    @Config
    @NotNull
    //IP地址或者dns名称
    private String    address;
    // 不知道为何，在运行时，必须为其加上，否则无法为link生成 @class 属性
    @JsonTypeIdResolver(MoIdResolver.class)
    @JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
    private Set<Link> outLinks;
    @JsonTypeIdResolver(MoIdResolver.class)
    @JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
    private Set<Link> inLinks;

    public String getAddress() {
        return address;
    }

    @NotNull
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Set<Link> getOutLinks() {
        return outLinks;
    }

    public void setOutLinks(Set<Link> outLinks) {
        this.outLinks = outLinks;
    }

    public Set<Link> getInLinks() {
        return inLinks;
    }

    public void setInLinks(Set<Link> inLinks) {
        this.inLinks = inLinks;
    }

    @Override
    public String toString() {
        return getSimpleClassName() + "(" + humanReadable() + ')';
    }

    protected String getSimpleClassName() {
        String simpleName = getClass().getSimpleName();
        if (simpleName.contains("$$"))
            return simpleName.substring(0, simpleName.indexOf("$$"));
        return simpleName;
    }

    protected String humanReadable() {
        List<String> names = new ArrayList<String>(2);
        if (StringUtils.isNotBlank(getLabel())) names.add(getLabel());
        if (StringUtils.isNotBlank(getAddress()) && !getAddress().equals(getLabel())) {
            names.add(getAddress());
        }
        return StringUtils.join(names, "@");
    }

    /**
     * <h2>Mybatis直接查出来的对象类型与type不符合，都是Resource类型，需要在这里进行转换</h2>
     *
     * @param klass 实际需要映射的类型
     * @return 实际需要映射的类型实例，如MonitorEngine
     */
    public <R extends Resource> Resource becomes(Class<R> klass) {
        try{
            if( getClass().getName().equals(klass.getName()) ){
                return this;
            }
            R newResource = klass.newInstance();
            newResource.apply(this);
            return newResource;
        }catch (Exception ex ){
            System.err.println("Can't convert " + getSimpleClassName() + " to " + klass.getSimpleName());
            return this;
        }
    }

    //把字符串转换为url路径上的元素
    // 需要做如下转换:
    //<ul>
    //<li> . -> _
    //<li> / -> -
    //<li> : -> _
    //<li> clean white space
    //</ul>
    public static String convertAsPath(String string) {
        String replaced = StringUtils.replaceChars(string, "./:", "_-_");
        return StringUtils.deleteWhitespace(replaced);
    }
}
