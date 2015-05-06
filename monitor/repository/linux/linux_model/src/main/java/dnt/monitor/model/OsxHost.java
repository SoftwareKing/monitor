package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.shell.Command;
import dnt.monitor.annotation.shell.Mapping;

import java.util.Date;

/**
 * <h1>OSX主机资源</h1>
 *
 * @author Jay Xiong
 */
@Category("osx")
@Command("uname -sr")
@Mapping({"os", "version"})
public class OsxHost extends Host{
    private static final long serialVersionUID = 4710927946430530358L;

    public OsxHost() {
        setType("/device/host/osx");
    }

    @Command("sysctl -n kern.boottime | awk '{print $4}' | awk -F, '{print $1}'")
    @Override
    public void setStartAt(Date startAt) {
        super.setStartAt(startAt);
    }

    @Command("sysctl -n hw.ncpu")
    @Override
    public void setCpuCount(Integer cpuCount) {
        super.setCpuCount(cpuCount);
    }
}
