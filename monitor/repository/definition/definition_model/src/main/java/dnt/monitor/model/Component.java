/**
 * Developer: Kadvin Date: 14/12/25 上午11:27
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import dnt.monitor.annotation.Anchor;
import net.happyonroad.util.StringUtils;

/**
 * 资源的组件，如主机的CPUs, Disks, Interfaces
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class )
@JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY, property = "type")
@Anchor
public class Component<R extends Resource> extends ManagedObject {

    private static final long serialVersionUID = 3416851238749699045L;
    //所属的资源
    private R    resource;
    //所属的资源ID
    private Long resourceId;

    public Resource getResource() {
        return resource;
    }

    public void setResource(R resource) {
        this.resource = resource;
        if (this.resource != null && this.resource.getId() != null) {
            setResourceId(this.resource.getId());
        }
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getType() {
        return getClass().getName();
    }

    @JsonIgnore
    public String getSimpleClassName() {
        return reduceCglibName(getClass().getSimpleName());
    }

    @JsonIgnore
    public String getPlainLabel(){
        return plain(getLabel());
    }

    /**
     * 将字符串改为url友好型的字符串
     *
     * @param input 原始字符串
     * @return 修改过后的字符串
     */
    public static String plain(String input){
        return StringUtils.replaceChars(input, "/?#&:\\", "_@-@__");
    }
}
