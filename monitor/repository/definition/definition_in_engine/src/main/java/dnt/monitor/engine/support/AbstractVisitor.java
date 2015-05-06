package dnt.monitor.engine.support;

import dnt.monitor.service.Visitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.model.Credential;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <h1>The Abstract Visitor</h1>
 *
 * @author Jay Xiong
 */
public abstract class AbstractVisitor<C extends Credential> implements Visitor<C> {
    protected final ManagedNode node;
    protected final C           credential;
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    protected Resource resource;

    public AbstractVisitor(ManagedNode node, Resource resource, C credential) {
        this.node = node;
        this.credential = credential;
        this.resource = resource;
    }

    @Override
    public ManagedNode getNode() {
        return node;
    }

    @Override
    public Resource getResource() {
        return resource;
    }

    @Override
    public void setResource(Resource resource) {
        this.resource = resource;
    }

    @Override
    public C getCredential() {
        return credential;
    }

    @Override
    public void close() {
        //do nothing
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + getResource().getAddress() + ")";
    }
}
