package dnt.monitor.engine.support;

import dnt.monitor.engine.service.*;
import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Component;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.service.Visitor;

import java.util.List;

/**
 * <h1>采集特定主机所使用的一整套对象</h1>
 *
 * @author Jay Xiong
 */
public class DefaultSampleHelper implements SampleHelper {
    private       Visitor        visitor;
    private final VisitorFactory visitorFactory;
    private final SampleService  sampleService;

    public DefaultSampleHelper(VisitorFactory factory, Visitor visitor, SampleService sampleService) {
        this.visitorFactory = factory;
        this.visitor = visitor;
        this.sampleService = sampleService;
    }

    public Visitor getVisitor() {
        return visitor;
    }

    public VisitorFactory getVisitorFactory() {
        return visitorFactory;
    }

    public SampleService getSampleService() {
        return sampleService;
    }

    @Override
    public boolean isAvailable() {
        return visitor.isAvailable();
    }

    @Override
    public void renew() throws EngineException {
        ResourceNode node = (ResourceNode) visitor.getNode();
        Resource resource = visitor.getResource();
        //noinspection unchecked
        this.visitor = visitorFactory.visitor(node, visitor.getCredential());
        if (!this.visitor.isAvailable()) {
            throw new EngineException("Can't sample " + resource + " by " + visitor + " after re-create it");
        }

    }

    @Override
    public void returnBack() {
        //noinspection unchecked
        this.visitorFactory.returnBack(visitor);
    }

    @Override
    public Resource sampleResource(MetaResource model) throws SampleException {
        return this.sampleService.sampleResource(visitor, model);
    }

    @Override
    public List<Component> sampleComponents(MetaRelation relation, Object...args) throws SampleException{
        //noinspection unchecked
        return ((GenericSampleService)this.sampleService).sampleComponents(visitor, relation, args);
    }

    @Override
    public Resource getResource() {
        return visitor.getResource();
    }

    @Override
    public String getResourceType() {
        return getResource().getType();
    }

    @Override
    public boolean isGenericSampleService() {
        return sampleService instanceof GenericSampleService;
    }

    @Override
    public String toString() {
        return visitor.toString() + "/" + sampleService.getClass().getSimpleName();
    }
}
