/**
 * Developer: Kadvin Date: 14/12/26 下午11:50
 */
package dnt.monitor.server.support;

import dnt.monitor.model.Resource;
import dnt.monitor.model.WinService;
import dnt.monitor.model.WindowsHost;
import dnt.monitor.server.repository.WindowsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * <h1>Windows Manager</h1>
 * 由于WindowsService里面没有什么新的方法，所以不进行扩展
 *   但WindowsRepository需要重新实现一些映射，所以需要进行扩展
 */
@Service
class WindowsManager extends HostManager<WindowsHost> {

    @Autowired
    public WindowsManager(@Qualifier("windowsRepository") WindowsRepository repository) {
        super(repository);
    }

    @Override
    public Class<? extends Resource> getResourceType() {
        return WindowsHost.class;
    }

    protected void assemble(WindowsHost host) {
        if(host.getSystemServices() != null )
            for (WinService service : host.getSystemServices()) {
                service.setResource(host);
            }

    }
}
