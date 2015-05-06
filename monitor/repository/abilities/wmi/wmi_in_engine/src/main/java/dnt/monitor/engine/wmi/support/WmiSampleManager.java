package dnt.monitor.engine.wmi.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.support.DefaultGenericSampleManager;
import dnt.monitor.engine.wmi.WmiVisitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import net.happyonroad.model.Credential;
import net.happyonroad.model.GeneralMap;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>WMI Sample Manager</h1>
 *
 * @author Jay Xiong
 */
@Component
class WmiSampleManager extends DefaultGenericSampleManager<WmiVisitor> {
    @Override
    protected String supportedCredentials() {
        return Credential.Windows;
    }

    @Override
    protected GeneralMap<String, Object> sampleSingleInstance(WmiVisitor visitor,
                                                                    MetaModel metaModel, MetaRelation metaRelation,
                                                                    boolean onlyKeyed)
            throws SampleException {
        return null;
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleMultipleInstance(WmiVisitor visitor,
                                                                      MetaModel metaModel, MetaRelation metaRelation,
                                                                      boolean onlyKeyed, Object... args)
            throws SampleException {
        return null;
    }

    @Override
    protected GeneralMap<String, Object> sampleField(WmiVisitor visitor, MetaModel metaModel,
                                                     Object model, MetaField metaField, boolean onlyKeyed)
            throws SampleException {
        return null;
    }

    @Override
    protected FieldComputer getFieldComputer() {
        return null;
    }
}
