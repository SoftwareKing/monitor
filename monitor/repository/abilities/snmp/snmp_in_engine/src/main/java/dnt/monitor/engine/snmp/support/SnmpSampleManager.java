package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.support.DefaultGenericSampleManager2;
import dnt.monitor.meta.MetaSnmp;
import dnt.monitor.service.sampling.CommandHandler;
import net.happyonroad.credential.SnmpCredential;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <h1>SNMP采集服务</h1>
 *
 * @author Jay Xiong
 */
@Service
public class SnmpSampleManager extends DefaultGenericSampleManager2<MibAwareSnmpVisitor, MetaSnmp> {

    @Autowired
    CommandHandler<MibAwareSnmpVisitor> commandHandler;

    @Override
    protected CommandHandler defaultCommandHandler() {
        return commandHandler;
    }

    public SnmpSampleManager() {
        super(MetaSnmp.class);
        setOrder(50);
    }

    @Override
    protected String supportedCredentials() {
        return SnmpCredential.Snmp;
    }

}
