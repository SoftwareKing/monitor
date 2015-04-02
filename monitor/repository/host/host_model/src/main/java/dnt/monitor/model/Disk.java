/**
 * Developer: Kadvin Date: 14/12/25 下午2:55
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.ssh.Command;
import dnt.monitor.annotation.ssh.Mapping;

/**
 * <h1>磁盘对象</h1>
 * Host -has many-> Disks
 */
@Anchor("plainLabel")
@Command("iostat -dkN 1 1")
@Mapping(value = {"label","tps","rbps","wbps","",""},skipLines = 3)
public class Disk extends Component<Host> {
    private static final long serialVersionUID = 7742146719079608548L;

    @Metric
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    @Metric(unit = "次/秒")
    private Long rps;
    @Metric(unit = "次/秒")
    private Long wps;
    @Metric(unit = "次/秒")
    private Long tps;
    @Metric(unit = "KB/秒")
    private Long rbps;
    @Metric(unit = "KB/秒")
    private Long wbps;
    @Metric(unit = "KB/秒")
    private Long tbps;

    public Long getRps() {
        return rps;
    }

    public void setRps(Long rps) {
        this.rps = rps;
    }

    public Long getWps() {
        return wps;
    }

    public void setWps(Long wps) {
        this.wps = wps;
    }

    public Long getTps() {
        return tps;
    }

    public void setTps(Long tps) {
        this.tps = tps;
    }

    public Long getRbps() {
        return rbps;
    }

    public void setRbps(Long rbps) {
        this.rbps = rbps;
    }

    public Long getWbps() {
        return wbps;
    }

    public void setWbps(Long wbps) {
        this.wbps = wbps;
    }

    public Long getTbps() {
        return tbps;
    }

    public void setTbps(Long tbps) {
        this.tbps = tbps;
    }
}
