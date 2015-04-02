/**
 * Developer: Kadvin Date: 15/3/10 上午9:12
 */
package dnt.monitor.model;

import net.happyonroad.model.IpRange;

/**
 * <h1>指向IP范围的管理节点</h1>
 */
public class RangeNode extends GroupNode {
    private static final long serialVersionUID = 6516150681738058657L;
    private IpRange range;

    public IpRange getRange() {
        return range;
    }

    public void setRange(IpRange range) {
        this.range = range;
    }
}
