package dnt.monitor.engine.jmx.support;

import dnt.monitor.engine.jmx.JmxVisitor;
import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.support.DefaultGenericSampleManager;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import net.happyonroad.model.Credential;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.management.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * <h1>Jmx Sample Manager</h1>
 *
 * @author Jay Xiong
 */
@Component
class JmxSampleManager extends DefaultGenericSampleManager<JmxVisitor> {

    @Autowired
    //FOR test purpuse
    @Qualifier("jmxFieldComputer")
    FieldComputer fieldComputer;

    @Override
    protected String supportedCredentials() {
        return Credential.Jmx;
    }

    @Override
    protected GeneralMap<String, Object> sampleSingleInstance(JmxVisitor visitor,
                                                              MetaModel metaModel,
                                                              MetaRelation metaRelation,
                                                              boolean onlyKeyed)
            throws SampleException {
        try {
            MBeanServerConnection connection = visitor.getConnector().getMBeanServerConnection();
            ObjectName objectName = metaModel.getAttribute(ObjectName.class);
            if(objectName == null ){
                return new DefaultGeneralMap<String, Object>();
            }
            //noinspection unchecked
            List<MetaField> fields = metaModel.getFields();
            return sampleObject(connection, objectName, fields);
        } catch (Exception ex) {
            throw new SampleException("Can't sample " + metaModel, ex);
        }
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleMultipleInstance(JmxVisitor visitor,
                                                                      MetaModel metaModel,
                                                                      MetaRelation metaRelation,
                                                                      boolean onlyKeyed, Object... args)
            throws SampleException {
        List<GeneralMap<String, Object>> list = new ArrayList<GeneralMap<String, Object>>();
        try {
            MBeanServerConnection connection = visitor.getConnector().getMBeanServerConnection();
            ObjectName objectName = metaModel.getAttribute(ObjectName.class);
            ObjectName collectionName;
            if( objectName.getCanonicalName().contains("*")){
                collectionName = objectName;
            }else{
                collectionName = new ObjectName(objectName.getCanonicalName() + ",*");
            }
            Set<ObjectName> names = connection.queryNames(collectionName, null);
            //noinspection unchecked
            List<MetaField> fields = metaModel.getFields();
            for (ObjectName name : names) {
                GeneralMap<String, Object> map = sampleObject(connection, name, fields);
                list.add(map);
            }
        } catch (Exception ex) {
            throw new SampleException("Can't sample " + metaModel, ex);
        }

        return list;
    }

    GeneralMap<String, Object> sampleObject(MBeanServerConnection connection, ObjectName objectName,
                                            List<MetaField> fields)
            throws MBeanException, AttributeNotFoundException, InstanceNotFoundException, ReflectionException,
                   IOException {
        GeneralMap<String, Object> map = new DefaultGeneralMap<String, Object>();
        for (MetaField field : fields) {
            Object value = connection.getAttribute(objectName, StringUtils.capitalize(field.getName()));
            map.put(field.getName(), value);
        }
        return map;
    }

    @Override
    protected GeneralMap<String, Object> sampleField(JmxVisitor visitor, MetaModel metaModel,
                                                     Object model, MetaField metaField,
                                                     boolean onlyKeyed)
            throws SampleException {
        GeneralMap<String, Object> result = new DefaultGeneralMap<String, Object>();
        Attribute attribute = metaField.getAttribute(Attribute.class);
        if( attribute == null )
            return null;
        ObjectName objectName = metaField.getAttribute(ObjectName.class);
        if( objectName == null ){
            objectName = metaModel.getAttribute(ObjectName.class);
        }
        if( objectName == null ){
            return null;
        }
        try{
            MBeanServerConnection connection = visitor.getConnector().getMBeanServerConnection();
            if( objectName.getCanonicalName().contains("*")) {
                Set<ObjectName> names = connection.queryNames(objectName, null);
                DefaultGeneralMap<String, Object> collection = new DefaultGeneralMap<String, Object>();
                for (ObjectName name : names) {
                    try {
                        Object value = connection.getAttribute(name, attribute.getName());
                        collection.put(name.getKeyProperty("name"), value);
                    } catch (Exception e) {
                        logger.warn("Ignore {}, because of {}", name, MiscUtils.describeException(e));
                    }
                }
                result.put(metaField.getName(), collection);

            }else{
                Object value = connection.getAttribute(objectName, attribute.getName());
                result.put(metaField.getName(), value);
            }
        }catch (Exception ex){
            throw new SampleException("Can't sample " + metaModel + "." + metaField, ex);
        }
        return result;
    }

    @Override
    protected FieldComputer getFieldComputer() {
        return fieldComputer;
    }
}
