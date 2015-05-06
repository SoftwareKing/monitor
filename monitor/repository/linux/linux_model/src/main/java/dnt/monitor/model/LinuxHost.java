/**
 * Developer: Kadvin Date: 14/12/23 下午4:17
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.shell.Command;
import dnt.monitor.annotation.shell.Mapping;
import dnt.monitor.annotation.shell.Value;
import net.happyonroad.model.Credential;

import java.util.Date;

/**
 * Linux主机资源
 */
@Category(value = "linux", credentials = Credential.Ssh)
@Command("uname -ro")
@Mapping({"version","os"})
public class LinuxHost extends Host {
    private static final long serialVersionUID = 8795142095490844466L;

    public LinuxHost() {
        setType("/device/host/linux");
    }

    @Command("echo $((`date +%s`-`cat /proc/uptime | awk '{split($1,a,\".\");print a[1];}'`))")
    @Value(converter = "secondToDate")
    @Override
    public void setStartAt(Date startAt) {
        super.setStartAt(startAt);
    }

    @Command("cat /proc/cpuinfo | grep \"processor\"|sort -u|wc -l")
    @Override
    public void setCpuCount(Integer cpuCount) {
        super.setCpuCount(cpuCount);
    }
}
