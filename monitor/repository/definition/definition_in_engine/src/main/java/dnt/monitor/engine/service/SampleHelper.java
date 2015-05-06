package dnt.monitor.engine.service;

import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Component;
import dnt.monitor.model.Resource;
import dnt.monitor.service.Visitor;

import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author Jay Xiong
 */
public interface SampleHelper {
    boolean isAvailable();

    void renew() throws EngineException;

    void returnBack();

    Resource sampleResource(MetaResource model) throws SampleException;

    String getResourceType();

    Resource getResource();

    boolean isGenericSampleService();

    List<Component> sampleComponents(MetaRelation relation, Object...args) throws SampleException;

    Visitor getVisitor();
}
