/**
 * Developer: Kadvin Date: 14/12/25 下午12:49
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.shell.*;
import dnt.monitor.annotation.snmp.Table;
import dnt.monitor.annotation.snmp.Transformer;
import dnt.monitor.handler.PartitionTransformerHandler;

/**
 * <h1>分区/文件系统</h1>
 * Host -has many-> Partitions
 */
@Anchor("plainLabel")
@Shell({
               @OS(type = "linux",
                   command = @Command("df -BG -PT | grep -v ^Filesystem | sed s/%/\\ \\ /g"),
                   mapping = @Mapping({"label", "fsType", "total", "used", "free", "capacity", "mountPoint"})
// Filesystem   Type  1073741824-blocks  Used Available Capacity Mounted on
// /dev/lv_root ext4                18G   11G        6G      64% /
               ),
               @OS(type = "aix",
                   command = @Command("df -g | grep -v \"/proc\" | tail -n +2 |  sed s/%/\\ \\ /g |" +
                                      " awk '{ print $1,$2,$2-$3,$3,$4,$7}'"),
                   mapping = @Mapping({"label", "total", "used", "free", "capacity", "mountPoint"})

               ),
               @OS(type = "osx",
                   command = @Command("df -P -g | grep -v ^Filesystem | sed s/%/\\ \\ /g"),
                   mapping = @Mapping(pattern = "([\\w| ]+)\\s{2,}(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+([^\\s]*)",
                                      value = {"label", "total", "used", "free", "capacity", "mountPoint"})
// Filesystem    1G-blocks Used Available Capacity  Mounted on
// /dev/disk1          464  103       361    23%    /
// map auto_home         0    0         0   100%    /home
               )
       })
@dnt.monitor.annotation.snmp.OS(
        tables = {
                @Table(value = "1.3.6.1.2.1.25.2.3", prefix = "hr", timeout = "1m", name = "main"),
                @Table(value = "1.3.6.1.2.1.25.3.8", prefix = "hr", timeout = "1m", name = "type")
        },
        transformer = @Transformer(PartitionTransformerHandler.class)
)
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

    @Metric(unit = "G")
    @Shell(@OS(type = "linux", value = @Value(converter = "extractor", format = "(\\d+)G?")))
    private Float total;
    @Metric(unit = "G")
    @Shell(@OS(type = "linux", value = @Value(converter = "extractor", format = "(\\d+)G?")))
    private Float free;
    @Metric(unit = "G")
    @Shell(@OS(type = "linux", value = @Value(converter = "extractor", format = "(\\d+)G?")))
    private Float used;
    @Metric(unit = "%")
    private Float usage;
    @Metric(unit = "%")
    private Float capacity;

    public String getFsType() {
        return fsType;
    }

    public void setFsType(String fsType) {
        this.fsType = fsType;
    }

    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Float getFree() {
        return free;
    }

    public void setFree(Float free) {
        this.free = free;
    }

    public Float getUsed() {
        return used;
    }

    public void setUsed(Float used) {
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

    public Float getCapacity() {
        return capacity;
    }

    public void setCapacity(Float capacity) {
        this.capacity = capacity;
        if (capacity != null) {
            this.usage = 100 - capacity;
        }
    }
}
