/**
 * Developer: Kadvin Date: 14/12/23 下午1:13
 */
package dnt.monitor.server.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import dnt.monitor.model.Link;
import net.happyonroad.model.PropertiesSupportRecord;

/**
 * The topo link
 * <p/>
 * 执行2级关联策略，也就是查A对象可以带出B对象，但不能再带出B对象关联的C对象；
 * 所以需要把B对象中C对象的ID映射出来
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
@JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY)
public class TopoLink extends PropertiesSupportRecord {
    private static final long serialVersionUID = -4225182872848465537L;
    // Map ID
    private Long     mapId;
    // Map
    private TopoMap  map;
    // 源节点ID: 之所以把节点对象和关联属性都映射出来，是为了能够支持程序后继映射
    private Long     fromId;
    // 源节点
    private TopoNode fromNode;
    // 目标节点ID
    private Long     toId;
    // 目标节点
    private TopoNode toNode;
    // 目标节点ID
    private Long     linkId;
    //实际的业务链路
    //  没有，说明该Link没有对应的Link关系
    private Link     link;

    //名称 Link不存在时，这个属性就承载了用户设置的显示名称
    private String label;
    //名称 Link的显示类型，(是否带箭头啥的，与前端实现技术相关)
    private String type;

    public Long getMapId() {
        return mapId;
    }

    public void setMapId(Long mapId) {
        this.mapId = mapId;
    }

    public TopoMap getMap() {
        return map;
    }

    public void setMap(TopoMap map) {
        this.map = map;
        if (map != null) setMapId(map.getId());
    }

    public TopoNode getFromNode() {
        return fromNode;
    }

    public void setFromNode(TopoNode fromNode) {
        this.fromNode = fromNode;
        if (fromNode != null) setFromId(fromNode.getId());
    }

    public TopoNode getToNode() {
        return toNode;
    }

    public void setToNode(TopoNode toNode) {
        this.toNode = toNode;
        if( toNode != null ) setToId(toNode.getId());
    }

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

    public Long getLinkId() {
        return linkId;
    }

    public void setLinkId(Long linkId) {
        this.linkId = linkId;
    }

    public Link getLink() {
        return link;
    }

    public void setLink(Link link) {
        this.link = link;
        if( link != null ) setLinkId(link.getId());
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return formatNode(fromNode, fromId) + formatLink() + formatNode(toNode, toId);
    }

    protected String formatNode(TopoNode node, Long id) {
        return node == null ? "TopoNode(" + id + ")" : node.toString();

    }

    protected String formatLink() {
        return " -" + getType() + "-" + (getLink() == null ? "" : getLink().directionalArrow()) + " ";
    }
}
