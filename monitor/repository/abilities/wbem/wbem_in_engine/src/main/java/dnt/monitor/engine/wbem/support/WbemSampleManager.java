package dnt.monitor.engine.wbem.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.support.DefaultGenericSampleManager;
import dnt.monitor.engine.wbem.WbemVisitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import net.happyonroad.model.Credential;
import net.happyonroad.model.GeneralMap;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>Wbem Sample Manager</h1>
 *
 * @author Jay Xiong
 */
@Component
class WbemSampleManager extends DefaultGenericSampleManager<WbemVisitor> {

    @Override
    protected String supportedCredentials() {
        return Credential.Webem;
    }

    @Override
    protected GeneralMap<String, Object> sampleSingleInstance(WbemVisitor visitor,
                                                                    MetaModel metaModel, MetaRelation metaRelation,
                                                                    boolean onlyKeyed)
            throws SampleException {
        return null;
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleMultipleInstance(WbemVisitor visitor,
                                                                      MetaModel metaModel, MetaRelation metaRelation,
                                                                      boolean onlyKeyed, Object... args)
            throws SampleException {
        return null;
    }

    @Override
    protected GeneralMap<String, Object> sampleField(WbemVisitor visitor, MetaModel metaModel,
                                                     Object model, MetaField metaField, boolean onlyKeyed)
            throws SampleException {
        return null;
    }

    @Override
    protected FieldComputer getFieldComputer() {
        return null;
    }
}
