package dnt.monitor.engine.shell.support;

import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.engine.shell.ShellVisitorFactory;
import dnt.monitor.engine.support.CommonVisitorFactory;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.ShellCredential;
import net.happyonroad.model.Credential;
import org.apache.commons.lang.SystemUtils;
import org.springframework.stereotype.Component;

/**
 * <h1>Default Shell Visitor Factory</h1>
 *
 * @author Jay Xiong
 */
@Component
class DefaultShellVisitorFactory extends CommonVisitorFactory<ShellCredential,ShellVisitor> implements ShellVisitorFactory {
    @Override
    protected ShellVisitor createVisitor(ManagedNode node, Resource resource, ShellCredential credential) {
        if(SystemUtils.IS_OS_WINDOWS){
            return new PowerShellVisitor(node, resource, credential);
        }else{
            //linux or osx now
            return new BashShellVisitor(node, resource, credential);
        }
    }

    @Override
    public boolean support(String address) {
        //only 主机地址，不支持 socket地址
        return !address.contains(":");
    }

    @Override
    public boolean support(Credential credential) {
        return credential instanceof LocalCredential;
    }
}
