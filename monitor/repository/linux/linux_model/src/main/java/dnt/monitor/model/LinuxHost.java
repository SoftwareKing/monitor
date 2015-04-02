/**
 * Developer: Kadvin Date: 14/12/23 下午4:17
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import net.happyonroad.model.Credential;

/**
 * Linux主机资源
 */
@Category(value = "linux", credentials = Credential.Ssh)
public class LinuxHost extends Host {
    private static final long serialVersionUID = 8795142095490844466L;

    public LinuxHost() {
        setType("/device/host/linux");
    }
}
