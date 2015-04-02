/**
 * Developer: Kadvin Date: 14/12/25 下午12:49
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;

/**
 * <h1>分区/文件系统</h1>
 * Host -has many-> Partitions
 */
@Anchor("plainLabel")
@Command("df -PTm | sed s/%/\\ \\ /g")
@Mapping(skipLines = 1,value = {"label","fsType","total","used","free","usage","mountPoint"})
public class Partition extends Component<Host> {
    private static final long serialVersionUID = -8115827764468684538L;

    @Config
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    @Config
    private String fsType;
    @Config
    private String mountPoint;

    @Metric
    private Long   total;
    @Metric
    private Long   free;
    @Metric
    private Long   used;
    @Metric
    private Float  usage;

    public String getFsType() {
        return fsType;
    }

    public void setFsType(String fsType) {
        this.fsType = fsType;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Long getFree() {
        return free;
    }

    public void setFree(Long free) {
        this.free = free;
    }

    public Long getUsed() {
        return used;
    }

    public void setUsed(Long used) {
        this.used = used;
    }

    public Float getUsage() {
        return usage;
    }

    public void setUsage(Float usage) {
        this.usage = usage;
    }

    public String getMountPoint() {
        return mountPoint;
    }

    public void setMountPoint(String mountPoint) {
        this.mountPoint = mountPoint;
    }

}
