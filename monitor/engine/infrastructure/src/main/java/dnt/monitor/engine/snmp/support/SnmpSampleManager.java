package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.service.Visitor;
import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.snmp.SnmpVisitorFactory;
import dnt.monitor.engine.support.DefaultSampleManager;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.*;
import dnt.monitor.meta.snmp.MetaGroup;
import dnt.monitor.meta.snmp.MetaTable;
import dnt.monitor.model.*;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.model.GeneralMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/**
 * <h1>SNMP采集服务</h1>
 *
 * @author Jay Xiong
 */
@Service
@SuppressWarnings("unchecked")
public class SnmpSampleManager extends DefaultSampleManager {

    @Autowired
    SnmpVisitorFactory visitorFactory;

    @Autowired
    SnmpFieldComputer snmpFieldComputer;

    @Override
    protected Visitor visitor(ResourceNode node) throws SampleException {
        SnmpCredential credential = node.getCredential(SnmpCredential.class);
        if (credential == null)
            throw new SampleException("There is no snmp credential in " + node);
        return visitorFactory.visitor(node, credential);
    }

    @Override
    protected void returnBackVisitor(ResourceNode node, Visitor visitor) {

    }

    @Override
    protected List<GeneralMap<String, Object>> sampleSingleInstance(Visitor visitor, ResourceNode node, MetaModel metaModel, boolean onlyKeyed) throws SampleException {
        List<GeneralMap<String, Object>> result = new ArrayList<GeneralMap<String, Object>>();
        MetaGroup metaGroup = metaModel.getSnmpGroup();
        if (null == metaGroup) {
            throw new SampleException("MetaModel MetaGroup is null! MetaModel name is " + metaModel.getName() + "! Resource Id is " + node.getResource().getId());
        }
        GeneralMap<String, Object> groupValue;
        try {
            groupValue = ((FullSnmpVisitor) visitor).walk(metaGroup.getValue(), metaGroup.getPrefix());
            result.add(groupValue);
        } catch (SnmpException e) {
            throw new SampleException("MetaModel GroupValue is null! MetaModel name is " + metaModel.getName() + "! Resource Id is " + node.getResource().getId());
        }
        return result;
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleMultipleInstance(Visitor visitor, ResourceNode node, MetaModel metaModel, boolean onlyKeyed) throws SampleException {
        MetaTable metaTable = metaModel.getSnmpTable();
        if (null == metaTable) {
            return new ArrayList<GeneralMap<String, Object>>();
        }
        List<GeneralMap<String, Object>> tableValue;
        try {
            tableValue = ((FullSnmpVisitor) visitor).table(metaTable.getValue(), metaTable.getPrefix());
        } catch (SnmpException e) {
            logger.error("MetaResource TableValue is null! MetaModel name is " + metaModel.getName() + "! Resource Id is " + node.getResource().getId());
            tableValue = new ArrayList<GeneralMap<String, Object>>();
        }
        return tableValue;
    }

    @Override
    protected GeneralMap<String, Object> sampleField(Visitor visitor, ResourceNode node, MetaModel metaModel, Object model, MetaField metaField, boolean onlyKeyed) throws SampleException {
        return null;
    }

    @Override
    protected FieldComputer getFieldComputer() {
        return snmpFieldComputer;
    }
}
