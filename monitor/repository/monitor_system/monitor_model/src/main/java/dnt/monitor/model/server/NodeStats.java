package dnt.monitor.model.server;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

/**
 * <h1>Node 的统计</h1>
 *
 * @author Jay Xiong
 */
@ObjectName("dnt.monitor.server:type=service,name=nodeService")
public class NodeStats extends Entry {
    private static final long serialVersionUID = 255966051197188536L;

    private long nodeSize, groupNodeSize, rangeNodeSize, resourceNodeSize;

    public long getNodeSize() {
        return nodeSize;
    }

    public void setNodeSize(long nodeSize) {
        this.nodeSize = nodeSize;
    }

    public long getGroupNodeSize() {
        return groupNodeSize;
    }

    public void setGroupNodeSize(long groupNodeSize) {
        this.groupNodeSize = groupNodeSize;
    }

    public long getRangeNodeSize() {
        return rangeNodeSize;
    }

    public void setRangeNodeSize(long rangeNodeSize) {
        this.rangeNodeSize = rangeNodeSize;
    }

    public long getResourceNodeSize() {
        return resourceNodeSize;
    }

    public void setResourceNodeSize(long resourceNodeSize) {
        this.resourceNodeSize = resourceNodeSize;
    }
}
