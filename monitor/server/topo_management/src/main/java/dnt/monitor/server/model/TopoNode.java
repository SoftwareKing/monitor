/**
 * Developer: Kadvin Date: 14/12/23 下午1:13
 */
package dnt.monitor.server.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import dnt.monitor.model.ManagedNode;
import net.happyonroad.model.PropertiesSupportRecord;
import net.happyonroad.type.Point;
import net.happyonroad.type.Size;


/**
 * The topo node
 */
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class )
@JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY)
public class TopoNode extends PropertiesSupportRecord {
    private static final long serialVersionUID = -6720647210286671644L;
    //所属的Map对象
    private TopoMap     map;
    private Long        mapId;
    //两级关联策略执行时，不映射node，所以必须要映射path
    private String      path;
    //该topo节点是否是叶子节点（资源类型对应的节点）
    private boolean     leaf;
    //对应的Group/Range节点(采用path映射)
    private ManagedNode node;
    //名称，在一个图中，一个节点可能对应多个TopoNode（取不同的别名）
    //  节点不存在时，这个属性就承载了用户设置的显示名称
    private String      label;
    //图标，默认为对应节点的icon
    //  节点不存在时，这个属性就承载了用户设置的显示名称
    private String      icon;
    //节点在图中的位置
    private Point       coordinate;
    //图层序号
    private Integer     layer;
    //旋转角度
    private Float       rotate;
    //图元的大小
    private Size        size;

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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Point getCoordinate() {
        return coordinate;
    }

    public void setCoordinate(Point coordinate) {
        this.coordinate = coordinate;
    }

    public Integer getLayer() {
        return layer;
    }

    public void setLayer(Integer layer) {
        this.layer = layer;
    }

    public Float getRotate() {
        return rotate;
    }

    public void setRotate(Float rotate) {
        this.rotate = rotate;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public TopoMap getMap() {
        return map;
    }

    public void setMap(TopoMap map) {
        this.map = map;
        if(map != null ) setMapId(map.getId());
    }

    public Long getMapId() {
        return mapId;
    }

    public void setMapId(Long mapId) {
        this.mapId = mapId;
    }
    @Override
    public String toString() {
        return "TopoNode(" + label + ')';
    }

    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }

    public boolean isLeaf() {
        return leaf;
    }
}
