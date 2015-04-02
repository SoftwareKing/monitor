/**
 * Developer: Kadvin Date: 14/12/23 下午1:13
 */
package dnt.monitor.server.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import dnt.monitor.model.ManagedNode;
import net.happyonroad.model.PropertiesSupportRecord;

import java.util.Set;

/**
 * The topo map record
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class )
@JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY)
public class TopoMap extends PropertiesSupportRecord{
    private static final long serialVersionUID = 3432178650101807081L;
    //对应的Group/Range节点(采用path映射)
    private ManagedNode node;
    //Node path
    private String      path;
    //图的名称，一个节点可能对应多个图，所以图的名称未必就是节点名称
    private String      label;
    //背景图
    private String      background;
    //背景图定位位置: 放到properties中去
    //private Point  backgroundCenter;
    //缩放比例
    private Float       scale;
    //布局策略: 这仅是前端交互时设置的属性
    // private String layout;

    // 图中的节点
    private Set<TopoNode> nodes;
    // 图中的链路
    private Set<TopoLink> links;

    // 直接子节点中得
    private int mapSize;
    private int nodeSize;


    public ManagedNode getNode() {
        return node;
    }

    public void setNode(ManagedNode node) {
        this.node = node;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getBackground() {
        return background;
    }

    public void setBackground(String background) {
        this.background = background;
    }

    public Float getScale() {
        return scale;
    }

    public void setScale(Float scale) {
        this.scale = scale;
    }

    //用Set，会在序列化时丢失其中对象的class，所以要在方法上增加这个说明
    // 否则，用 TopoNode[] 就不需要增加annotation
    @JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY)
    public Set<TopoNode> getNodes() {
        return nodes;
    }

    public void setNodes(Set<TopoNode> nodes) {
        this.nodes = nodes;
    }

    @JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY)
    public Set<TopoLink> getLinks() {
        return links;
    }

    public void setLinks(Set<TopoLink> links) {
        this.links = links;
    }

    public int getMapSize() {
        return mapSize;
    }

    public void setMapSize(int mapSize) {
        this.mapSize = mapSize;
    }

    public int getNodeSize() {
        return nodeSize;
    }

    public void setNodeSize(int nodeSize) {
        this.nodeSize = nodeSize;
    }

    @Override

    public String toString() {
        return "TopoMap(" + label + ')';
    }
}
