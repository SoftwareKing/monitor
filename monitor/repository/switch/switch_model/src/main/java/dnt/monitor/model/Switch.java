package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Keyed;

/**
 * <h1>The network switch</h1>
 *
 * @author Jay Xiong
 */
@Category("switch")
public class Switch extends Device {
    private static final long serialVersionUID = -7953615599849544108L;

    public Switch() {
        setType("/device/switch");
    }

    @Keyed
    private CdpEntry[] cdpEntries;

    public CdpEntry[] getCdpEntries() {
        return cdpEntries;
    }

    public void setCdpEntries(CdpEntry[] cdpEntries) {
        this.cdpEntries = cdpEntries;
    }
}
