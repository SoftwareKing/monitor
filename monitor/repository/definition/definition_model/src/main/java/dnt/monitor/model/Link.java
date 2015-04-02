/**
 * Developer: Kadvin Date: 14/12/23 下午3:30
 */
package dnt.monitor.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * 两个Resource之间的链接
 * 尽量不要继承，如果需要扩展，应该采用单表继承
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class )
public class Link extends ManagedObject {

    private static final long serialVersionUID = -7830816579336689926L;
    private Long fromId;
    private Resource from;
    private Long     toId;
    private Resource to;

    public Long getFromId() {
        return fromId;
    }

    public void setFromId(Long fromId) {
        this.fromId = fromId;
    }

    public Long getToId() {
        return toId;
    }

    public void setToId(Long toId) {
        this.toId = toId;
    }

    public Resource getFrom() {
        return from;
    }

    public void setFrom(Resource from) {
        this.from = from;
        if(this.from != null ) this.fromId = this.from.getId();
    }

    public Resource getTo() {
        return to;
    }

    public void setTo(Resource to) {
        this.to = to;
        if(this.to != null ) this.toId = this.to.getId();
    }

    @Override
    public String toString() {
        return formatResource(getFrom(), getFromId()) + " -" + getType() + "-"
                + directionalArrow()
                + formatResource(getTo(), getToId());
    }

    private String formatResource(Resource resource, Long resourceId) {
        return resource == null ? "Resource(" + resourceId +")" : resource.toString();
    }

    public String directionalArrow(){
        return LinkType.valueOf(getType()).isDirection() ? "> " : " ";
    }
}
