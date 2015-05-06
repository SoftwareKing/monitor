package dnt.monitor.service;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaModel;

/**
 * <h1>Helper to resolve meta model</h1>
 *
 * @author Jay Xiong
 */
public interface MetaModelResolverHelper {
    void resolveModel(Class klass, MetaModel metaModel) throws MetaException;
}
