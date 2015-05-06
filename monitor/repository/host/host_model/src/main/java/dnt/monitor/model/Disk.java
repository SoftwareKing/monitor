/**
 * Developer: Kadvin Date: 14/12/25 下午2:55
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Metric;
import dnt.monitor.annotation.shell.Command;
import dnt.monitor.annotation.shell.Mapping;
import dnt.monitor.annotation.shell.OS;
import dnt.monitor.annotation.shell.Shell;

/**
 * <h1>磁盘对象</h1>
 * Host -has many-> Disks
 */
@Anchor("plainLabel")
@Shell({

        @OS(type = "linux", command = @Command("iostat -dkN 1 1 | tail -n +4"),
                mapping = @Mapping(value = {"label", "tps", "rbps", "wbps", "", ""})),
        // @OS(type = "aix" , command = @Command("iostat -d 2 1 | egrep -v -e '^$' | tail -n +3"),
        @OS(type = "aix" , command = @Command("iostat -D 1 1 | tail -n +4 | sed 'N;s/\\n//' | awk '/xfer/{dev=$1;act=$8;bps=$9;tps=$10;rbps=$11;wbps=$12};/read:/{rps=$8};/write:/{wps=$8};/queue:/{print dev,act,bps,rbps,wbps,tps,rps,wps}'|awk 'function cvt( n ){t = n/1024 ;if ( sub(\"K\",\"\",n) == 1){t = n ;} else if ( 1 == sub(\"M\",\"\",n) ) { t = 1024*n; } else if ( 1 == sub(\"G\",\"\",n) ) { t = 1024*1024*n; } else if  ( 1 == sub(\"T\",\"\",n) ) { t = 1024*1024*1024*n;  } return t ; }  { printf \"%s %d %.2f %.2f %.2f %.2f %.2f %.2f\\n\",$1,$2,cvt($3),cvt($4),cvt($5),$6,$7,$8}'"),
                mapping = @Mapping(value = {"label","act","tbps","rbps","wbps","tps","rps","wps"}))

})
//SNMP not support for DIO of host
public class Disk extends Component<Host> {
    private static final long serialVersionUID = 7742146719079608548L;

    @Config
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    @Metric(unit = "次/秒")
    private Long tps;
    @Metric(unit = "KB/秒")
    private Long rbps;
    @Metric(unit = "KB/秒")
    private Long wbps;
    @Metric(unit = "次/秒")
    private Long rps;
    @Metric(unit = "次/秒")
    private Long wps;
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
