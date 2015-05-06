package dnt.monitor.engine.wmi.support;

import dnt.monitor.engine.support.CommonVisitorFactory;
import dnt.monitor.engine.wmi.WmiVisitor;
import dnt.monitor.engine.wmi.WmiVisitorFactory;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.WindowsCredential;
import net.happyonroad.model.Credential;
import org.springframework.stereotype.Component;

/**
 * <h1>Default WmiVisitor Factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultWmiVisitorFactory extends CommonVisitorFactory<WindowsCredential, WmiVisitor>
        implements WmiVisitorFactory{

    @Override
    protected WmiVisitor createVisitor(ManagedNode node, Resource resource, WindowsCredential credential) {
        return new WmicVisitor(node, resource, credential);
    }

    @Override
    public boolean support(String address) {
        //only 主机地址，不支持 socket地址
        return !address.contains(":");
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof WindowsCredential;
    }
}
