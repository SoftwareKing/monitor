package dnt.monitor.engine.jdbc.support;

import dnt.monitor.engine.jdbc.JdbcVisitor;
import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.support.DefaultGenericSampleManager;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import net.happyonroad.model.Credential;
import net.happyonroad.model.GeneralMap;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <h1>JDBC Sample Manager</h1>
 *
 * @author Jay Xiong
 */
@Component
class JdbcSampleManager extends DefaultGenericSampleManager<JdbcVisitor> {
    @Override
    protected String supportedCredentials() {
        return Credential.Jdbc;
    }

    public JdbcSampleManager() {
        setOrder(100);
    }

    @Override
    protected GeneralMap<String, Object> sampleSingleInstance(JdbcVisitor visitor,
                                                                    MetaModel metaModel, MetaRelation metaRelation,
                                                                    boolean onlyKeyed)
            throws SampleException {
        return null;
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleMultipleInstance(JdbcVisitor visitor,
                                                                      MetaModel metaModel, MetaRelation metaRelation,
                                                                      boolean onlyKeyed, Object... args)
            throws SampleException {
        return null;
    }

    @Override
    protected GeneralMap<String, Object> sampleField(JdbcVisitor visitor, MetaModel metaModel,
                                                     Object model, MetaField metaField, boolean onlyKeyed)
            throws SampleException {
        return null;
    }

    @Override
    protected FieldComputer getFieldComputer() {
        return null;
    }
}
