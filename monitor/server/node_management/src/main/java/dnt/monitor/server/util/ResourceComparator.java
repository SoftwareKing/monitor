/**
 * Developer: Kadvin Date: 14/12/22 上午11:17
 */
package dnt.monitor.server.util;

import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.ResourceNode;

import java.util.Comparator;

/**
 * 根据层次关系比较两个管理节点
 */
public class ResourceComparator implements Comparator<ManagedNode> {
    @Override
    public int compare(ManagedNode o1, ManagedNode o2) {
        int level1 = level(o1);
        int level2 = level(o2);
        if( level1 == level2)
            return typeOrder(o1) - typeOrder(o2);
        return level2 - level1;
    }

    private int level(ManagedNode node) {
        return node.getPath().split("/").length;
    }

    private int typeOrder(ManagedNode node) {
        if( !(node instanceof ResourceNode) ) return 0;
        ResourceNode resourceNode = (ResourceNode) node;
        String type = resourceNode.getResource().getType();
        if( type == null ) return 0;
        if( "/application/monitor_engine".equals(type))
            return Integer.MAX_VALUE;
        return 0;
    }
}
