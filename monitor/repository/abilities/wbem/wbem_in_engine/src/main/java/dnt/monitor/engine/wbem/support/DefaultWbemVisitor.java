package dnt.monitor.engine.wbem.support;

import dnt.monitor.engine.support.AbstractVisitor;
import dnt.monitor.engine.wbem.WbemVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;

import javax.wbem.client.WBEMClient;

/**
 * <h1>Default Webem Visitor</h1>
 *
 * @author Jay Xiong
 */
class DefaultWbemVisitor extends AbstractVisitor<CredentialProperties> implements WbemVisitor {

    private final WBEMClient client;

    public DefaultWbemVisitor(ManagedNode node, Resource resource, CredentialProperties credential, WBEMClient client) {
        super(node, resource, credential);
        this.client = client;
    }

    public WBEMClient getClient() {
        return client;
    }

    @Override
    public boolean isAvailable() {
        return true;//TODO HOW TO JUDGE client is valid or not
    }
}
