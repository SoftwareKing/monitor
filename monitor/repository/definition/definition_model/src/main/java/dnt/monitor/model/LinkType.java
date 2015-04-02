/**
 * Developer: Kadvin Date: 15/1/6 下午10:30
 */
package dnt.monitor.model;

/**
 * Link的基本类型
 */
public enum LinkType {
    // Monitor 这个关系与系统的path表达的监控信息貌似有点重复
    //  可能这个关系只需要在 Topo层有TopoLink表达，而不需要在实际资源层有相应的表达
    //Monitor(true),
    RunOn(true), Standby(false), Depends(true), Connect(false), UpLink(true);

    private final boolean direction;

    LinkType(boolean direction) {
        this.direction = direction;
    }

    public boolean isDirection() {
        return direction;
    }
}
