/**
 * Developer: Kadvin Date: 14/12/23 下午4:17
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import net.happyonroad.model.Credential;

import java.util.List;

/**
 * Windows主机资源
 */
@Category(value = "windows", credentials = Credential.Windows)
public class WindowsHost extends Host {
    public WindowsHost() {
        setType("/device/host/windows");
    }

    private static final long serialVersionUID = -1823048556639755771L;
    private List<WinService> systemServices;

    public List<WinService> getSystemServices() {
        return systemServices;
    }

    public void setSystemServices(List<WinService> services) {
        this.systemServices = services;
    }
}
