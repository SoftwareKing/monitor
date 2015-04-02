package dnt.monitor.server.support;

import dnt.monitor.model.Resource;
import dnt.monitor.model.Switch;
import dnt.monitor.server.repository.SwitchRepository;
import dnt.monitor.server.service.SwitchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

/**
 * <h1>Switch Manager</h1>
 *
 * @author Jay Xiong
 */
@org.springframework.stereotype.Service
public class SwitchManager<S extends Switch> extends DeviceManager<S> implements SwitchService<S> {
    @Autowired
    public SwitchManager( @Qualifier("switchRepository") SwitchRepository<S> repository) {
        super(repository) ;
    }

    protected SwitchRepository<S> getRepository(){
        return (SwitchRepository<S>) super.getRepository();
    }

    @Override
    public Class<? extends Resource> getResourceType() {
        return Switch.class;
    }

    @Override
    protected void performUpdate(Resource legacy, S updating) {
        if(!Switch.class.isAssignableFrom(legacy.getClass()) ){
            //说明 t_switches 里面没有相应的记录
            getRepository().createPartialSwitch(updating);
        }
        super.performUpdate(legacy, updating);
    }
}
