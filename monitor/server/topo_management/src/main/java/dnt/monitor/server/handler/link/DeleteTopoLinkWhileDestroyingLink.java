/**
 * Developer: Kadvin Date: 15/1/14 下午1:43
 */
package dnt.monitor.server.handler.link;

import dnt.monitor.model.Link;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.event.ObjectDestroyingEvent;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <h1>Delete topo link while link destroying</h1>
 */
@Component
class DeleteTopoLinkWhileDestroyingLink extends Bean
        implements ApplicationListener<ObjectDestroyingEvent<Link>> {
    @Autowired
    TopoService topoService;

    @Override
    public void onApplicationEvent(ObjectDestroyingEvent<Link> event) {
        Link link = event.getSource();
        try {
            topoService.deleteLink(link);
        } catch (TopoException e) {
            throw new ApplicationContextException("Can't delete topo link for " + link, e);
        }
    }
}
