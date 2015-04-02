/**
 * Developer: Kadvin Date: 14/12/26 下午11:41
 */
package dnt.monitor.model;

import dnt.monitor.annotation.Anchor;
import dnt.monitor.annotation.Config;
import dnt.monitor.annotation.Indicator;
import dnt.monitor.annotation.Metric;

/**
 * Windows Service
 */
@Anchor("plainLabel")
public class WinService extends Component<WindowsHost>{
    private static final long serialVersionUID = 6274126327840827861L;

    @Config
    @Override
    public String getLabel() {
        return super.getLabel();
    }

    @Metric
    private String policy;
    @Metric
    //TODO Define as Enum?
    private String status;

    @Indicator
    private String description;

    public String getPolicy() {
        return policy;
    }

    public void setPolicy(String policy) {
        this.policy = policy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
