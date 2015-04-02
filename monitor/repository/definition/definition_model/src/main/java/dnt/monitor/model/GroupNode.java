/**
 * Developer: Kadvin Date: 15/3/10 上午9:10
 */
package dnt.monitor.model;

import java.util.LinkedList;
import java.util.List;

/**
 * <h1>指向静态群组的节点</h1>
 */
public class GroupNode extends ManagedNode {
    private static final long serialVersionUID = 2012725181909011997L;
    // 直接子节点中得
    private int groupSize;
    private int resourceSize;

    // 子节点
    private List<ManagedNode> children;

    public void addChild(ManagedNode child) {
        if (this.children == null)
            this.children = new LinkedList<ManagedNode>();
        children.add(child);
    }

    public List<ManagedNode> getChildren() {
        return children;
    }

    public int getGroupSize() {
        return groupSize;
    }

    public void setGroupSize(int groupSize) {
        this.groupSize = groupSize;
    }

    public int getResourceSize() {
        return resourceSize;
    }

    public void setResourceSize(int resourceSize) {
        this.resourceSize = resourceSize;
    }

}
