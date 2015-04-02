package dnt.monitor.server.handler.node;

import dnt.monitor.model.Device;
import dnt.monitor.model.RangeNode;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.event.ObjectUpdatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>在交换机下面的Range节点被其他交换机关联之后，创建他们之间的Topo Link</h1>
 *
 * @author Jay Xiong
 */
@Component
public class CreateTopoLinkBetweenOtherSwitchAndRange extends Bean
        implements ApplicationListener<ObjectUpdatedEvent<RangeNode>> {

    @Autowired
    TopoService topoService;

    public CreateTopoLinkBetweenOtherSwitchAndRange() {
        setOrder(300);
    }

    @Override
    public void onApplicationEvent(ObjectUpdatedEvent<RangeNode> event) {
        RangeNode legacySource = event.getLegacySource();
        String legacyUpLink = legacySource.getProperty(Device.PROPERTY_UP_LINK);
        RangeNode rangeNode = event.getSource();
        String upLink = rangeNode.getProperty(Device.PROPERTY_UP_LINK);
        if(StringUtils.isBlank(upLink)){
            return;
        }
        if( StringUtils.equals(legacyUpLink, upLink)) return;

        TopoNode switchNode = topoService.findNodeByResourceId(Integer.valueOf(upLink));
        TopoNode rangeTopoNode = topoService.findNodeByPath(rangeNode.getPath());
        try {
            topoService.createLink(rangeTopoNode, switchNode, "UpLink", "UpLink");
        } catch (TopoException e) {
            logger.warn("Can't auto crate topo link between subnet and its up-link switch: {}",
                        ExceptionUtils.getRootCauseMessage(e));
        }
    }
}
